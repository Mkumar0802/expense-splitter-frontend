<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let active = "users";

  function navigate(page) {
    if (active === page) return;
    active = page;
    window.history.pushState({}, "", `/${page}`);
    dispatch("routechange", { page });
  }

  onMount(() => {
    const path = window.location.pathname.replace("/", "") || "users";
    active = path;
    dispatch("routechange", { page: path });

    window.addEventListener("popstate", () => {
      const path = window.location.pathname.replace("/", "") || "users";
      if (active !== path) {
        active = path;
        dispatch("routechange", { page: path });
      }
    });
  });
</script>

<nav class="bg-white border-b shadow-sm border-border">
  <div class="px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
          <span class="text-sm font-bold text-white">ES</span>
        </div>
        <h1 class="text-xl font-bold text-text-primary">ExpenseSplit</h1>
      </div>

      <!-- Navigation -->
      <div class="flex space-x-1">
        <button
          class="flex items-center px-4 py-2 space-x-2 text-sm font-medium transition-all duration-200 rounded-lg"
          class:bg-primary={active === "users"}
          class:text-white={active === "users"}
          class:text-text-secondary={active !== "users"}
          class:hover:bg-gray-50={active !== "users"}
          on:click={() => navigate("users")}
        >
          <span>👥</span>
          <span>Users</span>
        </button>

        <button
          class="flex items-center px-4 py-2 space-x-2 text-sm font-medium transition-all duration-200 rounded-lg"
          class:bg-primary={active === "expenses"}
          class:text-white={active === "expenses"}
          class:text-text-secondary={active !== "expenses"}
          class:hover:bg-gray-50={active !== "expenses"}
          on:click={() => navigate("expenses")}
        >
          <span>💰</span>
          <span>Expenses</span>
        </button>

        <button
          class="flex items-center px-4 py-2 space-x-2 text-sm font-medium transition-all duration-200 rounded-lg"
          class:bg-primary={active === "balance"}
          class:text-white={active === "balance"}
          class:text-text-secondary={active !== "balance"}
          class:hover:bg-gray-50={active !== "balance"}
          on:click={() => navigate("balance")}
        >
          <span>⚖️</span>
          <span>Balance</span>
        </button>
      </div>
    </div>
  </div>
</nav>