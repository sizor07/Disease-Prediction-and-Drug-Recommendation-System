import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Alert,
  Breadcrumb,
  Container,
  Row,
  Col,
  Badge,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Header from "../components/Doctor/Header";
import Sidebar from "../components/Doctor/Sidebar";

const AppointmentPanel = () => {
  const [allAppointments, setAllAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        const appointmentsQuery = query(
          collection(db, "diagnoses"),
          where("appointmentRequested", "==", true)
        );

        const querySnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({
            id: doc.id,
            ...data,
            appointmentRequestDate:
              data.appointmentRequestDate?.toDate() ||
              data.appointmentRequestDate,
            approvedDate: data.approvedDate?.toDate() || data.approvedDate,
          });
        });

        appointmentsData.sort((a, b) => {
          const dateA = a.appointmentRequestDate || new Date(0);
          const dateB = b.appointmentRequestDate || new Date(0);
          return dateB - dateA;
        });

        setAllAppointments(appointmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load appointments");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveClick = (appointment) => {
    setCurrentAppointment(appointment);
    setPreferredDate("");
    setPreferredTime("");
    setShowModal(true);
  };

  const handleApproveAppointment = async () => {
    if (!currentAppointment || !preferredDate || !preferredTime) {
      setError("Please select both date and time.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const appointmentRef = doc(db, "diagnoses", currentAppointment.id);
      await updateDoc(appointmentRef, {
        appointmentStatus: "approved",
        approvedDate: new Date(),
        preferredDate,
        preferredTime,
      });

      setAllAppointments((prevAppointments) =>
        prevAppointments.map((a) =>
          a.id === currentAppointment.id
            ? {
                ...a,
                appointmentStatus: "approved",
                approvedDate: new Date(),
                preferredDate,
                preferredTime,
              }
            : a
        )
      );

      setShowModal(false);
      setSuccess("Appointment approved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error approving appointment:", error);
      setError("Failed to approve appointment");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar open={true} width={240} userData={userData} />
      <div id="page-content-wrapper">
        <Header />
        <Container fluid className="py-4">
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/doctor" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Appointment Panel</Breadcrumb.Item>
          </Breadcrumb>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Row>
            <Col md={12}>
              <h4 className="text-center alert alert-info">
                All Appointment Requests
              </h4>

              {allAppointments.length === 0 ? (
                <Alert variant="info">No appointments found.</Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Request Date</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          {appointment.patientName ||
                            appointment.email ||
                            "N/A"}
                        </td>
                        <td>{appointment.predictedDisease || "N/A"}</td>
                        <td>
                          {appointment.appointmentRequestDate?.toLocaleString() ||
                            "N/A"}
                        </td>
                        <td>
                          {appointment.appointmentNotes || "No notes provided"}
                        </td>
                        <td>
                          <Badge
                            bg={
                              appointment.appointmentStatus === "pending"
                                ? "warning"
                                : appointment.appointmentStatus === "approved"
                                ? "success"
                                : "danger"
                            }
                          >
                            {appointment.appointmentStatus}
                          </Badge>
                        </td>
                        <td>
                          {appointment.appointmentStatus === "pending" ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveClick(appointment)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <span className="text-muted">No action needed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Are you sure you want to approve this appointment request?
                  </p>
                  {currentAppointment && (
                    <>
                      <p>
                        <strong>Patient:</strong>{" "}
                        {currentAppointment.patientName ||
                          currentAppointment.email ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Condition:</strong>{" "}
                        {currentAppointment.predictedDisease || "N/A"}
                      </p>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Select Preferred Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Select Preferred Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                          />
                        </Form.Group>
                      </Form>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleApproveAppointment}>
                    Confirm Approval
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AppointmentPanel;
