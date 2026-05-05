import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Breadcrumb,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";
import Header from "../components/Doctor/Header";
import Sidebar from "../components/Doctor/Sidebar";

const DrugRecommendationPanel = () => {
  const [diseases, setDiseases] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.uid);

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch diagnoses data
        const querySnapshot = await getDocs(collection(db, "diagnoses"));
        const diseasesData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          diseasesData.push({
            id: doc.id,
            ...data,
            recommendationDate:
              data.recommendationDate?.toDate?.() || data.recommendationDate,
            timestamp: data.timestamp?.toDate?.() || data.timestamp,
          });
        });

        // Sort by recommendation status and date (newest first)
        diseasesData.sort((a, b) => {
          // First separate recommended and non-recommended
          if (a.recomendation !== b.recomendation) {
            return a.recomendation ? 1 : -1; // Non-recommended comes first
          }

          // For items with same recommendation status, sort by timestamp (newest first)
          const dateA = a.timestamp || new Date(0);
          const dateB = b.timestamp || new Date(0);
          return dateB - dateA;
        });

        setDiseases(diseasesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRecommend = async (disease) => {
    try {
      const diseaseRef = doc(db, "diagnoses", disease.id);
      await updateDoc(diseaseRef, {
        recomendation: true,
        newRecommendation: true,
        recommendationDate: new Date(),
        recommendedBy: userData?.username || "Doctor",
      });

      // Update local state
      setDiseases((prevDiseases) => {
        const updated = prevDiseases.map((d) =>
          d.id === disease.id
            ? {
                ...d,
                recomendation: true,
                newRecommendation: true,
                recommendationDate: new Date(),
                recommendedBy: userData?.username || "Doctor",
              }
            : d
        );

        // Re-sort after update
        return updated.sort((a, b) => {
          if (a.recomendation !== b.recomendation) {
            return a.recomendation ? 1 : -1; // Non-recommended first
          }
          const dateA = a.timestamp || new Date(0);
          const dateB = b.timestamp || new Date(0);
          return dateB - dateA;
        });
      });
    } catch (error) {
      console.error("Error updating recommendation:", error);
      alert("Failed to save recommendation. Please try again.");
    }
  };

  const isNewRecommendation = (disease) => {
    if (!disease.newRecommendation) return false;
    const recommendationDate = disease.recommendationDate || new Date(0);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return recommendationDate > sevenDaysAgo;
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
              Drug Recommendation Panel
            </Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            <Col md={12}>
              <h4 className="text-center alert alert-info">
                List Of Disease Diagnosed
              </h4>

              <input type="hidden" defaultValue={userId} id="user_id" />
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Disease</th>
                    <th>Medicine</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {diseases.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.email || "N/A"}</td>
                      <td>{d.predictedDisease || "N/A"}</td>
                      <td>{d.recommendedDrug || "N/A"}</td>
                      <td>
                        <Button
                          variant={
                            d.recomendation ? "outline-primary" : "primary"
                          }
                          size="sm"
                          onClick={() => handleRecommend(d)}
                          disabled={d.recomendation}
                        >
                          {d.recomendation ? "Recommended" : "Recommend"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DrugRecommendationPanel;
