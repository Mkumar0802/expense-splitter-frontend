<script>
  import api from "../api/api.js";
  import UserForm from "../components/UserForm.svelte";
  import { onMount } from "svelte";

  let users = [];
  let isLoading = false;
  let error = null;

  async function loadUsers() {
    isLoading = true;
    error = null;
    try {
      const res = await api.get("/users");
      users = res.data.data || [];
    } catch (err) {
      console.error("Error loading users:", err);
      error = "Failed to load users";
      users = [];
    } finally {
      isLoading = false;
    }
  }

  onMount(loadUsers);
</script>

<div class="min-h-screen bg-surface">
  <div class="max-w-4xl px-6 py-8 mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-text-primary">Users</h1>
      <p class="text-text-secondary">Manage people in your expense group</p>
    </div>

    <!-- User Form -->
    <div class="mb-8">
      <UserForm on:refresh={loadUsers} />
    </div>

    <!-- User List -->
    <div class="bg-white border rounded-xl shadow-card border-border">
      <div class="p-6 border-b border-border">
        <h2 class="text-xl font-semibold text-text-primary">All Users ({users.length})</h2>
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
                <button on:click={loadUsers} class="mt-2 text-sm font-medium text-red-600 hover:text-red-500">
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
          <p class="mt-2 text-text-secondary">Loading users...</p>
        </div>
      {:else if users.length > 0}
        <div class="divide-y divide-border">
          {#each users as user (user.id)}
            <div class="p-6 transition-colors hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <span class="text-sm font-semibold text-primary">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-medium text-text-primary">{user.name}</h3>
                    {#if user.phoneNumber}
                      <p class="text-sm text-text-secondary">{user.phoneNumber}</p>
                    {/if}
                  </div>
                </div>
                <span class="px-2 py-1 text-sm bg-gray-100 rounded text-text-muted">
                  ID: {user.id}
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="p-8 text-center">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="mb-1 text-lg font-medium text-text-primary">No users yet</h3>
          <p class="text-text-secondary">Add your first user to get started</p>
        </div>
      {/if}
    </div>
  </div>
</div>