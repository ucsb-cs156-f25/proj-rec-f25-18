import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

import AppNavbar from "main/components/Nav/AppNavbar";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { vi } from "vitest";

describe("AppNavbar tests", () => {
  const queryClient = new QueryClient();

  test("renders correctly for regular logged in user", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar currentUser={currentUser} doLogin={doLogin} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Welcome, pconrad.cis@gmail.com");
  });

  test("renders correctly for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar currentUser={currentUser} doLogin={doLogin} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Welcome, phtcon@ucsb.edu");
    const adminMenu = screen.getByTestId("appnavbar-admin-dropdown");
    expect(adminMenu).toBeInTheDocument();
  });

  test("renders H2Console and Swagger links correctly", async () => {
    const currentUser = currentUserFixtures.adminUser;
    const systemInfo = systemInfoFixtures.showingBoth;

    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("H2Console");
    const swaggerMenu = screen.getByText("Swagger");
    expect(swaggerMenu).toBeInTheDocument();
  });

  test("renders the AppNavbarLocalhost when on http://localhost:3000", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    delete window.location;
    window.location = new URL("http://localhost:3000");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("AppNavbarLocalhost");
    expect(screen.getByTestId("AppNavbarLocalhost-message1").textContent).toBe(
      "Running on http://localhost:3000/ with no backend.",
    );
    expect(screen.getByTestId("AppNavbarLocalhost-message2").textContent).toBe(
      "You probably want http://localhost:8080 instead.",
    );
  });

  test("renders the AppNavbarLocalhost when on http://127.0.0.1:3000", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    delete window.location;
    window.location = new URL("http://127.0.0.1:3000");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("AppNavbarLocalhost");
  });

  test("does NOT render the AppNavbarLocalhost when on localhost:8080", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    delete window.location;
    window.location = new URL("http://localhost:8080");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("AppNavbar");
    expect(screen.queryByTestId(/AppNavbarLocalhost/i)).toBeNull();
  });

  test("when oauthlogin undefined, default value is used", async () => {
    const currentUser = currentUserFixtures.notLoggedIn;
    const systemInfo = systemInfoFixtures.oauthLoginUndefined;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar currentUser={currentUser} systemInfo={systemInfo} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Log In");
    expect(screen.getByText("Log In")).toHaveAttribute(
      "href",
      "/oauth2/authorization/google",
    );
  });

  test("renders the three prof pages correctly for professor users", async () => {
    const currentUser = currentUserFixtures.professorUser;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Pending Requests");
    const pendingLink = screen.getByText("Pending Requests");
    expect(pendingLink).toBeInTheDocument();

    await screen.findByText("Completed Requests");
    const completedLink = screen.getByText("Completed Requests");
    expect(completedLink).toBeInTheDocument();

    await screen.findByText("Statistics");
    const statisticsLink = screen.getByText("Statistics");
    expect(statisticsLink).toBeInTheDocument();
  });

  test("the three prof pages can not be seen by basic users", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Pending Requests")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed Requests")).not.toBeInTheDocument();
    expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
  });

  test("the three prof pages do not show when not logged in", async () => {
    const currentUser = null;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Pending Requests")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed Requests")).not.toBeInTheDocument();
    expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
  });

  test("admin dropdown renders for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;
  test("renders Request Recommendation link for logged in users", async () => {
    const currentUser = currentUserFixtures.userOnly;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar currentUser={currentUser} doLogin={doLogin} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const adminDropdown = await screen.findByTestId("appnavbar-admin-dropdown");
    expect(adminDropdown).toBeInTheDocument();
    await screen.findByText("Request Recommendation");
    const requestLink = screen.getByText("Request Recommendation");
    expect(requestLink).toBeInTheDocument();
    expect(requestLink).toHaveAttribute("href", "/requests/create");
  });

  test("Request Recommendation link appears for professor users", async () => {
    const currentUser = currentUserFixtures.professorUser;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar currentUser={currentUser} doLogin={doLogin} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText("Request Recommendation");
    const requestLink = screen.getByText("Request Recommendation");
    expect(requestLink).toBeInTheDocument();
  });

  test("Request Recommendation link does not show when not logged in", async () => {
    const currentUser = currentUserFixtures.notLoggedIn;
    const systemInfo = systemInfoFixtures.showingBoth;
    const doLogin = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppNavbar
            currentUser={currentUser}
            systemInfo={systemInfo}
            doLogin={doLogin}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.queryByText("Request Recommendation"),
    ).not.toBeInTheDocument();
  });
});
