import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function AppNavbar({ profile }) {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Navbar bg="info" expand="lg" className="mb-3 border-bottom">
      <div><img src="logo.png" alt="Logo" height="60" /></div>
      <Container>
        <Navbar.Brand href="/task" className="text-uppercase">Personal Task Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="crm-nav" />
        <Navbar.Collapse id="crm-nav">
          <Nav className="me-auto">

          </Nav>
          <div className="d-flex align-items-center">
            {profile && (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="primary"
                  id="dropdown-profile"
                  className="d-flex align-items-center gap-2"
                >
                  <FaUserCircle size={22} />
                  <span className="fw-semibold">
                    {profile.name} ({profile.role})
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
