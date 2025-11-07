<script>
  import api from "../api/api.js";
  import { createEventDispatcher } from "svelte";
  import toast from "svelte-french-toast";

  let name = "";
  let phoneNumber = "";
  let isLoading = false;
  let errors = {};
  let touched = {};

  const dispatch = createEventDispatcher();

  // Validation rules
  const validationRules = {
    name: (value) => {
      if (!value?.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (value.trim().length > 50) return "Name must be less than 50 characters";
      if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name can only contain letters and spaces";
      return null;
    },
    phoneNumber: (value) => {
      if (!value) return null; // Phone is optional

      // Normalize: remove all non-digits and possible leading +
      const digits = value.replace(/\D/g, '');

      // Indian mobile validation:
      // - plain 10 digits starting with 6-9 (e.g. 9876543210)
      // - 11 digits with leading 0 (0XXXXXXXXXX)
      // - 12 digits with leading country code 91 (91XXXXXXXXXX)
      const validPlain = /^[6-9]\d{9}$/.test(digits);
      const validWith0 = /^0[6-9]\d{9}$/.test(digits);
      const validWith91 = /^91[6-9]\d{9}$/.test(digits);

      if (validPlain || validWith0 || validWith91) return null;

      return "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 98765 43210)";
    }
  };

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
    
    errors.name = validateField("name", name);
    errors.phoneNumber = validateField("phoneNumber", phoneNumber);
    
    // Mark all fields as touched when submitting
    touched = { name: true, phoneNumber: true };

    return !Object.values(errors).some(error => error !== null);
  }

  // Helper to normalize phone for submission: return E.164-like string if possible
  function normalizeIndianPhone(value) {
    if (!value) return null;
    const digits = value.replace(/\D/g, '');
    if (/^[6-9]\d{9}$/.test(digits)) {
      return digits; // plain 10 digits
    }
    if (/^0[6-9]\d{9}$/.test(digits)) {
      return digits.slice(1); // drop leading 0
    }
    if (/^91[6-9]\d{9}$/.test(digits)) {
      return digits.slice(2); // drop leading 91 -> return 10 digits
    }
    // fallback to raw digits if something else slipped through
    return digits;
  }

  // Submit handler
  async function addUser() {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    isLoading = true;

    try {
      const normalizedPhone = normalizeIndianPhone(phoneNumber);
      const userData = {
        name: name.trim(),
        ...(normalizedPhone && { phoneNumber: normalizedPhone }) // Only include if provided
      };

      const res = await api.post("/users", userData);

      if (res.data?.success) {
        toast.success("✅ User added successfully!");
        
        // Reset form
        name = "";
        phoneNumber = "";
        errors = {};
        touched = {};
        
        // Notify parent component
        dispatch("userAdded", { user: res.data.data });
        dispatch("refresh");
      } else {
        throw new Error(res.data?.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      
      let errorMessage = "Failed to add user. Please try again.";
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid user data provided";
      } else if (err.response?.status === 409) {
        errorMessage = "A user with this name or phone number already exists";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to continue";
        dispatch("authError");
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      toast.error(errorMessage);
      dispatch("error", { type: "user_creation_failed", error: errorMessage });
    } finally {
      isLoading = false;
    }
  }

  // Real-time validation for better UX
  $: if (touched.name) {
    errors.name = validateField("name", name);
  }

  $: if (touched.phoneNumber) {
    errors.phoneNumber = validateField("phoneNumber", phoneNumber);
  }

  // Format Indian phone number for display:
  // - For plain 10-digit numbers show "98765 43210"
  // - For +91 or 91-prefixed numbers show "+91 98765 43210"
  // - For 0-prefixed show "0 98765 43210"
  function formatIndianPhoneForDisplay(raw) {
    if (!raw) return "";
    const digitsOnly = raw.replace(/\D/g, '');
    if (/^91[6-9]\d{9}$/.test(digitsOnly)) {
      const core = digitsOnly.slice(2);
      return `+91 ${core.slice(0,5)} ${core.slice(5)}`;
    }
    if (/^0[6-9]\d{9}$/.test(digitsOnly)) {
      const core = digitsOnly.slice(1);
      return `0 ${core.slice(0,5)} ${core.slice(5)}`;
    }
    if (/^[6-9]\d{9}$/.test(digitsOnly)) {
      return `${digitsOnly.slice(0,5)} ${digitsOnly.slice(5)}`;
    }
    // fallback: return original but trimmed
    return raw.trim();
  }

  // Handle phone number input with india-specific formatting
  function handlePhoneInput(event) {
    const input = event.target.value;
    const digits = input.replace(/\D/g, '');

    // If user starts with +91, keep +91 and format rest
    if (/^(\+91|91)/.test(input.trim())) {
      // unify to digits and re-add +91 display
      const digitsOnly = digits;
      if (digitsOnly.length <= 2) {
        phoneNumber = input; // let user type country code
      } else {
        const core = digitsOnly.slice(-10); // last 10 digits
        phoneNumber = `+91 ${core.slice(0,5)} ${core.slice(5)}`;
      }
    } else if (/^0/.test(digits)) {
      // leading 0
      if (digits.length <= 1) {
        phoneNumber = digits;
      } else {
        const core = digits.slice(1);
        if (core.length <= 5) {
          phoneNumber = `0 ${core}`;
        } else {
          phoneNumber = `0 ${core.slice(0,5)} ${core.slice(5)}`;
        }
      }
    } else {
      // plain entry
      if (digits.length <= 5) {
        phoneNumber = digits;
      } else if (digits.length <= 10) {
        phoneNumber = `${digits.slice(0,5)} ${digits.slice(5)}`;
      } else {
        // if user types extra digits (unlikely for mobi), keep last 10 as core
        const core = digits.slice(-10);
        phoneNumber = `${core.slice(0,5)} ${core.slice(5)}`;
      }
    }

    markAsTouched('phoneNumber');
  }
</script>

<div class="p-6 bg-white border rounded-xl shadow-card border-border">
  <h3 class="mb-4 text-lg font-semibold text-text-primary">Add New User</h3>
  
  <form on:submit|preventDefault={addUser} class="space-y-4">
    <!-- Name Field -->
    <div>
      <label for="name" class="block mb-1 text-sm font-medium text-text-primary">
        Name *
      </label>
      <input
        id="name"
        bind:value={name}
        on:blur={() => markAsTouched('name')}
        type="text"
        required
        placeholder="Enter full name"
        class="w-full px-3 py-2 text-black border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text-muted {errors.name ? 'border-red-500' : ''}"
        disabled={isLoading}
        maxlength="50"
      />
      {#if errors.name}
        <p class="mt-1 text-sm text-red-600">{errors.name}</p>
      {:else}
        <p class="mt-1 text-xs text-text-muted">
          {name.length}/50 characters
        </p>
      {/if}
    </div>

    <!-- Phone Number Field -->
    <div>
      <label for="phone" class="block mb-1 text-sm font-medium text-text-primary">
        Phone Number
      </label>
      <input
        id="phone"
        value={phoneNumber}
        on:input={handlePhoneInput}
        on:blur={() => markAsTouched('phoneNumber')}
        type="tel"
        placeholder="98765 43210 or +91 98765 43210"
        class="w-full px-3 py-2 text-black border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text-muted {errors.phoneNumber ? 'border-red-500' : ''}"
        disabled={isLoading}
        maxlength="25"
      />
      {#if errors.phoneNumber}
        <p class="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
      {:else}
        <p class="mt-1 text-xs text-text-muted">Optional — Indian mobile numbers (10 digits)</p>
      {/if}
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="flex items-center justify-center w-full py-2.5 px-4 rounded-lg font-medium bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {#if isLoading}
        <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Adding User...
      {:else}
        Add User
      {/if}
    </button>
  </form>
</div>
