<script>
  import api from "../api/api.js";
  import ExpenseForm from "../components/ExpenseForm.svelte";
  import { onMount } from "svelte";

  let expenses = [];
  let isLoading = false;
  let error = null;

  async function loadExpenses() {
    isLoading = true;
    error = null;
    try {
      const res = await api.get("/expenses");
      expenses = res.data.data || [];
    } catch (err) {
      console.error("Error loading expenses:", err);
      error = "Failed to load expenses";
      expenses = [];
    } finally {
      isLoading = false;
    }
  }

  onMount(loadExpenses);
</script>

<div class="min-h-screen bg-surface">
  <div class="max-w-6xl px-6 py-8 mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-text-primary">Expenses</h1>
      <p class="text-text-secondary">Track and manage shared expenses</p>
    </div>

    <!-- Stats -->
    {#if expenses.length > 0}
      <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div class="p-6 bg-white border rounded-xl shadow-card border-border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <span class="text-xl text-green-600">💰</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-text-secondary">Total Spent</p>
              <p class="text-2xl font-bold text-text-primary">
                ₹{expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 bg-white border rounded-xl shadow-card border-border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <span class="text-xl text-blue-600">📝</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-text-secondary">Total Expenses</p>
              <p class="text-2xl font-bold text-text-primary">{expenses.length}</p>
            </div>
          </div>
        </div>

        <div class="p-6 bg-white border rounded-xl shadow-card border-border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <span class="text-xl text-purple-600">👥</span>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-text-secondary">People Involved</p>
              <p class="text-2xl font-bold text-text-primary">
                {new Set(expenses.flatMap(e => [e.payer.id, ...e.participants.map(p => p.user.id)])).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Expense Form -->
    <div class="mb-8">
      <ExpenseForm on:refresh={loadExpenses} />
    </div>

    <!-- Expenses List -->
    <div class="bg-white border rounded-xl shadow-card border-border">
      <div class="p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-text-primary">Recent Expenses</h2>
      </div>

      {#if error}
        <div class="p-6 border-b border-border">
          <div class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{error}</h3>
                <button on:click={loadExpenses} class="mt-2 text-sm font-medium text-red-600 hover:text-red-500">
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}

      {#if isLoading}
        <div class="p-8 text-center">
          <div class="inline-block w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
          <p class="mt-2 text-text-secondary">Loading expenses...</p>
        </div>
      {:else if expenses.length > 0}
        <div class="divide-y divide-border">
          {#each expenses as e (e.id)}
            <div class="p-6 transition-colors hover:bg-gray-50">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 class="mb-1 text-lg font-semibold text-text-primary">{e.title}</h3>
                  <p class="text-sm text-text-secondary">
                    Paid by <span class="font-medium text-primary">{e.payer.name}</span>
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-primary">₹{e.amount}</p>
                  <p class="text-sm text-text-muted">
                    ₹{(e.amount / e.participants.length).toFixed(2)} each
                  </p>
                </div>
              </div>

              <div class="p-4 rounded-lg bg-gray-50">
                <p class="mb-2 text-sm font-medium text-text-primary">Participants:</p>
                <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {#each e.participants as p}
                    <div class="flex items-center justify-between px-3 py-1 bg-white border rounded">
                      <span class="text-sm text-text-primary">{p.user.name}</span>
                      <span class="text-sm font-medium text-green-600">
                        ₹{p.share || (e.amount / e.participants.length).toFixed(2)}
                      </span>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="p-8 text-center">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <span class="text-2xl">💸</span>
          </div>
          <h3 class="mb-1 text-lg font-medium text-text-primary">No expenses yet</h3>
          <p class="text-text-secondary">Add your first expense to get started</p>
        </div>
      {/if}
    </div>
  </div>
</div>