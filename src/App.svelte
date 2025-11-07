<script>

  import Navbar from "./components/Navbar.svelte";
  import Users from './pages/Users.svelte';
  import Expenses from './pages/Expenses.svelte';
  import Balance from './pages/Balance.svelte';
    import toast, { Toaster } from "svelte-french-toast";
  let currentPage = "users";
  let componentKey = 0; // Add this key to force re-render

  function handleRouteChange(event) {
    currentPage = event.detail.page;
    componentKey += 1; // Change the key to force re-render
  }
</script>

<Navbar on:routechange={handleRouteChange} />

<main class="p-4">
  {#if currentPage === 'users'}
    <Users key={componentKey} />
  {:else if currentPage === 'expenses'}
    <Expenses key={componentKey} />
  {:else if currentPage === 'balance'}
    <Balance key={componentKey} />
  {/if}
</main>


<Toaster position="top-right" />