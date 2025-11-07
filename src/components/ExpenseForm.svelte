<script>
  import api from "../api/api.js";
  import { onMount, createEventDispatcher } from "svelte";
  import MultiSelectCheckbox from "./MultiSelectCheckbox.svelte";
  import toast from "svelte-french-toast";

  let title = "";
  let amount = "";
  let payerId = "";
  let selectedParticipants = [];
  let users = [];
  let isLoading = false;
  let errors = {};
  let touched = {};

  const dispatch = createEventDispatcher();

  // Validation rules
  const validationRules = {
    title: (value) => {
      if (!value?.trim()) return "Expense title is required";
      if (value.trim().length < 2) return "Title must be at least 2 characters";
      if (value.trim().length > 100) return "Title must be less than 100 characters";
      return null;
    },
    amount: (value) => {
      if (!value) return "Amount is required";
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return "Amount must be a valid number";
      if (numValue <= 0) return "Amount must be greater than 0";
      if (numValue > 1000000) return "Amount must be less than ₹1,000,000";
      if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Amount can have up to 2 decimal places";
      return null;
    },
    payerId: (value) => {
      if (!value) return "Please select who paid";
      return null;
    },
    participants: (value) => {
      if (!value?.length) return "Select at least one participant";
      return null;
    }
  };

  // Fetch users with proper error handling
  onMount(async () => {
    await loadUsers();
  });

  async function loadUsers() {
    try {
      isLoading = true;
      const res = await api.get("/users");
      
      if (res.data?.success && Array.isArray(res.data.data)) {
        users = res.data.data;
        toast.success("Users loaded successfully");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error loading users:", err);
      const errorMessage = err.response?.data?.message || "Failed to load users";
      toast.error(errorMessage);
      dispatch("error", { type: "users_load_failed", error: errorMessage });
    } finally {
      isLoading = false;
    }
  }

  // Field validation
  function validateField(field, value) {
    const validator = validationRules[field];
    return validator ? validator(value) : null;
  }

  // Mark field as touched
  function markAsTouched(field) {
    touched = { ...touched, [field]: true };
  }

  // Form validation
  function validateForm() {
    errors = {};
    
    errors.title = validateField("title", title);
    errors.amount = validateField("amount", amount);
    errors.payerId = validateField("payerId", payerId);
    errors.participants = validateField("participants", selectedParticipants);
    
    // Mark all fields as touched when submitting
    touched = {
      title: true,
      amount: true,
      payerId: true,
      participants: true
    };

    return !Object.values(errors).some(error => error !== null);
  }

  // Enhanced submit handler
  async function createExpense() {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    isLoading = true;

    try {
      const allParticipants = [...new Set([...selectedParticipants, payerId])];
      
      const expenseData = {
        title: title.trim(),
        amount: parseFloat(amount),
        payerId: parseInt(payerId),
        participantIds: allParticipants.map(Number),
      };

      // Validate API data
      if (!expenseData.title || !expenseData.amount || !expenseData.payerId || !expenseData.participantIds.length) {
        throw new Error("Invalid expense data");
      }

      const res = await api.post("/expenses", expenseData);

      if (res.data?.success) {
        toast.success("✅ Expense added successfully!");

        // Reset form
        resetForm();
        
        // Notify parent component
        dispatch("expenseCreated", { expense: res.data.data });
        dispatch("refresh");
      } else {
        throw new Error(res.data?.message || "Failed to create expense");
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      
      let errorMessage = "Failed to create expense. Please try again.";
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid data provided";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to continue";
        dispatch("authError");
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to create expenses";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message?.includes("Network Error")) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast.error(errorMessage);
      dispatch("error", { type: "expense_creation_failed", error: errorMessage });
    } finally {
      isLoading = false;
    }
  }

  // Reset form function
  function resetForm() {
    title = "";
    amount = "";
    payerId = "";
    selectedParticipants = [];
    errors = {};
    touched = {};
  }

  // Real-time validation for better UX
  $: if (touched.title) {
    errors.title = validateField("title", title);
  }

  $: if (touched.amount) {
    errors.amount = validateField("amount", amount);
  }

  $: if (touched.payerId) {
    errors.payerId = validateField("payerId", payerId);
  }

  // Automatically ensure payer is in participants
  $: if (payerId && !selectedParticipants.includes(payerId)) {
    selectedParticipants = [...selectedParticipants, payerId];
  }

  // Preview share calculation with validation
  $: sharePerPerson = 
    amount && selectedParticipants.length > 0 && 
    !isNaN(parseFloat(amount)) && parseFloat(amount) > 0
      ? (parseFloat(amount) / selectedParticipants.length).toFixed(2)
      : 0;
</script>

<div class="max-w-md p-6 mx-auto bg-white border rounded-lg shadow-md border-border">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-semibold text-text-primary">Add Expense</h3>
    <button
      on:click={loadUsers}
      class="p-2 transition-colors text-text-muted hover:text-text-primary"
      title="Reload users"
      disabled={isLoading}
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  </div>

  <form on:submit|preventDefault={createExpense} class="space-y-4">
    <!-- Title Input -->
    <div>
      <label for="title" class="block mb-1 text-sm font-medium text-text-primary">
        Expense Title *
      </label>
      <input 
        id="title"
        bind:value={title}
        on:blur={() => markAsTouched('title')}
        type="text"
        placeholder="Dinner, Groceries, Movie tickets..."
        class="w-full px-3 py-2 bg-white border rounded-md text-text-primary placeholder-text-muted border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent {errors.title ? 'border-red-500' : ''}"
        disabled={isLoading}
        maxlength="100"
      />
      {#if errors.title}
        <p class="mt-1 text-sm text-red-600">{errors.title}</p>
      {:else}
        <p class="mt-1 text-xs text-text-muted">
          {title.length}/100 characters
        </p>
      {/if}
    </div>

    <!-- Amount Input -->
    <div>
      <label for="amount" class="block mb-1 text-sm font-medium text-text-primary">
        Total Amount (₹) *
      </label>
      <input 
        id="amount"
        bind:value={amount}
        on:blur={() => markAsTouched('amount')}
        type="number"
        placeholder="0.00"
        step="0.01"
        min="0.01"
        class="w-full px-3 py-2 bg-white border rounded-md text-text-primary placeholder-text-muted border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent {errors.amount ? 'border-red-500' : ''}"
        disabled={isLoading}
      />
      {#if errors.amount}
        <p class="mt-1 text-sm text-red-600">{errors.amount}</p>
      {/if}
    </div>

    <!-- Payer Select -->
    <div>
      <label for="payer" class="block mb-1 text-sm font-medium text-text-primary">
        Who Paid? *
      </label>
      <select 
        id="payer"
        bind:value={payerId}
        on:blur={() => markAsTouched('payerId')}
        class="w-full px-3 py-2 bg-white border rounded-md text-text-primary border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent {errors.payerId ? 'border-red-500' : ''}"
        disabled={isLoading || users.length === 0}
      >
        <option value="">Select who paid</option>
        {#each users as user}
          <option value={user.id}>{user.name}</option>
        {/each}
      </select>
      {#if errors.payerId}
        <p class="mt-1 text-sm text-red-600">{errors.payerId}</p>
      {/if}
      {#if users.length === 0 && !isLoading}
        <p class="mt-1 text-sm text-yellow-600">No users available. Please add users first.</p>
      {/if}
    </div>

    <!-- Participants Multi-select -->
    <div>
      <MultiSelectCheckbox 
        {users} 
        bind:selectedParticipants 
        label="Who should split this expense? *"
        disabled={isLoading || users.length === 0}
        error={errors.participants}
      />
      {#if errors.participants}
        <p class="mt-1 text-sm text-red-600">{errors.participants}</p>
      {/if}
    </div>

    <!-- Share Preview -->
    {#if amount && selectedParticipants.length > 0 && !errors.amount}
      <div class="p-3 border border-blue-200 rounded-lg bg-blue-50">
        <p class="text-sm text-blue-800">
          <span class="font-medium">Share per person:</span> 
          ₹{sharePerPerson} each
        </p>
        <p class="mt-1 text-xs text-blue-600">
          {selectedParticipants.length} {selectedParticipants.length === 1 ? 'person' : 'people'} × ₹{sharePerPerson} = ₹{(parseFloat(amount) || 0).toFixed(2)}
        </p>
      </div>
    {/if}

    <!-- Submit Button -->
    <button 
      type="submit"
      class="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition duration-200 ease-in-out rounded-md bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading || users.length === 0}
    >
      {#if isLoading}
        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Adding Expense...
      {:else}
        {users.length === 0 ? 'No Users Available' : 'Add Expense'}
      {/if}
    </button>
  </form>
</div>