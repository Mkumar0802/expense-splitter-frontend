<script>
  import { createEventDispatcher } from "svelte";
  import toast from "svelte-french-toast";

  export let users = [];
  export let selectedParticipants = [];
  export let label = "Participants";
  export let disabled = false;
  export let error = null;
  
  let searchQuery = "";
  const dispatch = createEventDispatcher();
  
  // Filter users based on search query
  $: filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phoneNumber && user.phoneNumber.includes(searchQuery))
  );

  function toggleUser(userId) {
    if (disabled) {
      toast.error("Selection is currently disabled");
      return;
    }

    try {
      if (selectedParticipants.includes(userId)) {
        selectedParticipants = selectedParticipants.filter(id => id !== userId);
        dispatch("userDeselected", { userId });
      } else {
        selectedParticipants = [...selectedParticipants, userId];
        dispatch("userSelected", { userId });
      }
    } catch (err) {
      console.error("Error toggling user:", err);
      toast.error("Failed to update selection");
    }
  }

  function selectAll() {
    if (disabled) {
      toast.error("Selection is currently disabled");
      return;
    }

    try {
      const usersToSelect = filteredUsers.map(user => user.id);
      if (usersToSelect.every(id => selectedParticipants.includes(id))) {
        // Deselect all filtered users
        selectedParticipants = selectedParticipants.filter(id => !usersToSelect.includes(id));
        dispatch("allDeselected", { userIds: usersToSelect });
        toast.success(`Deselected ${usersToSelect.length} users`);
      } else {
        // Select all filtered users
        selectedParticipants = [...new Set([...selectedParticipants, ...usersToSelect])];
        dispatch("allSelected", { userIds: usersToSelect });
        toast.success(`Selected ${usersToSelect.length} users`);
      }
    } catch (err) {
      console.error("Error in select all:", err);
      toast.error("Failed to update selection");
    }
  }

  function clearSearch() {
    searchQuery = "";
  }

  function clearAll() {
    if (disabled) {
      toast.error("Selection is currently disabled");
      return;
    }

    try {
      const previousCount = selectedParticipants.length;
      selectedParticipants = [];
      dispatch("allCleared", { previousCount });
      toast.success("Cleared all selections");
    } catch (err) {
      console.error("Error clearing selections:", err);
      toast.error("Failed to clear selections");
    }
  }

  // Check if all filtered users are selected
  $: allFilteredSelected = filteredUsers.length > 0 && 
    filteredUsers.every(user => selectedParticipants.includes(user.id));
  
  // Check if some filtered users are selected
  $: someFilteredSelected = filteredUsers.length > 0 && 
    filteredUsers.some(user => selectedParticipants.includes(user.id)) &&
    !allFilteredSelected;
</script>

<div class="w-full">
  <label class="block mb-2 text-sm font-medium text-text-primary {error ? 'text-red-600' : ''}">
    {label} ({selectedParticipants.length} selected)
  </label>
  
  <!-- Search Box -->
  <div class="relative mb-3">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search users..."
      class="w-full py-2 pl-10 pr-10 text-sm border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-text-muted disabled:opacity-50 disabled:cursor-not-allowed {error ? 'border-red-500' : ''}"
      disabled={disabled}
    />
    {#if searchQuery}
      <button
        on:click={clearSearch}
        class="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors text-text-muted hover:text-text-primary disabled:opacity-50"
        disabled={disabled}
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>

  <!-- Select All Toggle -->
  {#if filteredUsers.length > 0}
    <div class="flex items-center justify-between p-3 mb-3 border border-blue-200 rounded-lg bg-blue-50">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={allFilteredSelected}
          indeterminate={someFilteredSelected}
          on:change={selectAll}
          class="w-4 h-4 border-blue-300 rounded text-primary focus:ring-primary focus:ring-2 disabled:opacity-50"
          disabled={disabled}
        />
        <span class="text-sm font-medium text-blue-900">
          {allFilteredSelected ? 'All searched users selected' : 
           someFilteredSelected ? 'Some searched users selected' : 'Select all searched users'}
        </span>
      </div>
      <button
        type="button"
        on:click={selectAll}
        class="text-sm font-medium transition-colors text-primary hover:text-blue-800 disabled:opacity-50"
        disabled={disabled}
      >
        {allFilteredSelected ? 'Deselect All' : 'Select All'}
      </button>
    </div>
  {/if}

  <!-- Users List with Checkboxes -->
  <div class="overflow-y-auto bg-white border rounded-lg max-h-64 border-border {error ? 'border-red-500' : ''}">
    {#if users.length === 0}
      <div class="p-6 text-center">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
          <span class="text-lg text-gray-400">👥</span>
        </div>
        <p class="text-sm text-text-secondary">No users available</p>
        <p class="mt-1 text-xs text-text-muted">Add users first to split expenses</p>
      </div>
    {:else if filteredUsers.length === 0 && searchQuery}
      <div class="p-6 text-center">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
          <span class="text-lg text-gray-400">🔍</span>
        </div>
        <p class="text-sm text-text-secondary">No users found</p>
        <p class="mt-1 text-xs text-text-muted">Try a different search term</p>
      </div>
    {:else}
      <div class="divide-y divide-border">
        {#each filteredUsers as user (user.id)}
          <label class="flex items-center p-3 transition-colors cursor-pointer hover:bg-gray-50 group {disabled ? 'opacity-50 cursor-not-allowed' : ''}">
            <input
              type="checkbox"
              checked={selectedParticipants.includes(user.id)}
              on:change={() => toggleUser(user.id)}
              class="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary focus:ring-2 disabled:opacity-50"
              disabled={disabled}
            />
            <div class="flex items-center flex-1 min-w-0 ml-3">
              <div class="flex-1 min-w-0">
                <span class="block text-sm font-medium truncate text-text-primary">
                  {#if searchQuery}
                    {@html user.name.replace(
                      new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                      '<mark class="bg-accent px-0.5 rounded">$1</mark>'
                    )}
                  {:else}
                    {user.name}
                  {/if}
                </span>
                {#if user.phoneNumber}
                  <span class="block text-xs truncate text-text-muted">
                    {#if searchQuery && user.phoneNumber.includes(searchQuery)}
                      {@html user.phoneNumber.replace(
                        new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                        '<mark class="bg-accent px-0.5 rounded">$1</mark>'
                      )}
                    {:else}
                      {user.phoneNumber}
                    {/if}
                  </span>
                {/if}
              </div>
            </div>
            <div class="flex-shrink-0 ml-2 transition-opacity opacity-0 group-hover:opacity-100">
              {#if selectedParticipants.includes(user.id)}
                <div class="w-2 h-2 rounded-full bg-primary"></div>
              {/if}
            </div>
          </label>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Summary -->
  <div class="flex items-center justify-between mt-2">
    <p class="text-xs text-text-secondary">
      {selectedParticipants.length} of {users.length} participants selected
      {#if searchQuery && filteredUsers.length > 0}
        • {filteredUsers.length} found
      {/if}
    </p>
    
    {#if selectedParticipants.length > 0}
      <button
        type="button"
        on:click={clearAll}
        class="text-xs transition-colors text-text-muted hover:text-error disabled:opacity-50"
        disabled={disabled}
      >
        Clear all
      </button>
    {/if}
  </div>

  <!-- Error Message -->
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>

<style>
  /* Style for indeterminate checkbox state */
  input[type="checkbox"]:indeterminate {
    background-color: #083D77;
    border-color: #083D77;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10h8'/%3e%3c/svg%3e");
  }
  
  /* Remove default mark styling and use our accent color */
  mark {
    background-color: #F4D35E;
    color: inherit;
  }
</style>