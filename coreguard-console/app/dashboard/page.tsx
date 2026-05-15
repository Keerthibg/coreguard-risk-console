"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [newNote, setNewNote] = useState("");

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });

    document.cookie =
      "coreguard_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/login");
  };

  const loadEvents = async () => {
    setLoading(true);

    const res = await fetch("/api/events");
    const data = await res.json();

    setEvents(data);
    setLoading(false);
  };

  const updateStatus = async (status: string) => {
    if (!selectedEvent) return;

    await fetch(`/api/events/${selectedEvent.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    await loadEvents();

    setSelectedEvent({
      ...selectedEvent,
      status,
    });
  };
  
  const addNote = async () => {
    if (!selectedEvent || !newNote) return;
  
    await fetch(`/api/events/${selectedEvent.id}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newNote,
      }),
    });
  
    setNewNote("");
  
    await loadEvents();
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const criticalCount = events.filter(
    (e) => e.severity === "Critical"
  ).length;

  const openCount = events.filter(
    (e) => e.status === "Open"
  ).length;

  const escalatedCount = events.filter(
    (e) => e.status === "Escalated"
  ).length;

  const filteredEvents = events.filter((event) => {
    const text = search.toLowerCase();

    const matchesSearch =
      event.supplier.toLowerCase().includes(text) ||
      event.part.toLowerCase().includes(text) ||
      event.source.toLowerCase().includes(text) ||
      event.owner.toLowerCase().includes(text) ||
      event.summary.toLowerCase().includes(text);

    const matchesSeverity =
      severityFilter === "" ||
      event.severity === severityFilter;

    const matchesStatus =
      statusFilter === "" ||
      event.status === statusFilter;

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesStatus
    );
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* SIDEBAR */}

      <div
        style={{
          width: 260,
          background: "#0f172a",
          color: "white",
          padding: 20,
        }}
      >
        <h2>🛡️ CoreGuard</h2>

        <p>Risk Queue</p>
        <p>Audit Review</p>
        <p>Operations</p>

        <button
          onClick={logout}
          style={{
            marginTop: 30,
            width: "100%",
            padding: 10,
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}

      <div
        style={{
          flex: 1,
          padding: 30,
          background: "#f1f5f9",
        }}
      >
        <h1>Risk Review Console</h1>

        <p style={{ color: "gray" }}>
          Incoming supply-chain risk events
        </p>

        <button
          onClick={loadEvents}
          style={{
            marginTop: 10,
            padding: "10px 14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Refresh
        </button>

        {/* CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 20,
          }}
        >
          <Card
            label="Total Events"
            value={events.length}
          />

          <Card
            label="Critical Events"
            value={criticalCount}
          />

          <Card
            label="Open Events"
            value={openCount}
          />
        </div>

        {/* TABLE */}

        <div
          style={{
            marginTop: 30,
            background: "white",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h2>Risk Event Queue</h2>

          {/* FILTERS */}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <input
              placeholder="Search risk events..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                padding: 10,
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: 6,
              }}
            />

            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value)
              }
              style={{
                padding: 10,
                borderRadius: 6,
              }}
            >
              <option value="">
                All Severities
              </option>

              <option value="Critical">
                Critical
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                padding: 10,
                borderRadius: 6,
              }}
            >
              <option value="">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Reviewed">
                Reviewed
              </option>

              <option value="Escalated">
                Escalated
              </option>

              <option value="Resolved">
                Resolved
              </option>
            </select>
          </div>

          {/* TABLE CONTENT */}

          {loading ? (
            <p>Loading events...</p>
          ) : filteredEvents.length === 0 ? (
            <p>No risk events found.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom:
                      "1px solid #ddd",
                  }}
                >
                  <th>Supplier</th>
                  <th>Part/Asset</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Source</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() =>
                      setSelectedEvent(event)
                    }
                    style={{
                      borderBottom:
                        "1px solid #eee",
                      cursor: "pointer",
                    }}
                  >
                    <td
                      style={{
                        padding: 10,
                        color: "#2563eb",
                        fontWeight: "bold",
                      }}
                    >
                      {event.supplier}
                    </td>

                    <td>{event.part}</td>

                    <td>
                      <strong>
                        {event.severity}
                      </strong>
                    </td>

                    <td>{event.status}</td>

                    <td>{event.owner}</td>

                    <td>{event.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* DETAILS */}

          {selectedEvent ? (
            <div
              style={{
                marginTop: 30,
                background: "#f8fafc",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <h2>Event Details</h2>

              <p>
                <strong>Supplier:</strong>{" "}
                {selectedEvent.supplier}
              </p>

              <p>
                <strong>Part:</strong>{" "}
                {selectedEvent.part}
              </p>

              <p>
                <strong>Severity:</strong>{" "}
                {selectedEvent.severity}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedEvent.status}
              </p>

              <p>
                <strong>Owner:</strong>{" "}
                {selectedEvent.owner}
              </p>

              <p>
                <strong>Summary:</strong>{" "}
                {selectedEvent.summary}
              </p>

              <p>
                <strong>
                  Recommended Action:
                </strong>{" "}
                {
                  selectedEvent.recommendedAction
                }
              </p>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  onClick={() =>
                    updateStatus("Reviewed")
                  }
                  style={{
                    padding: "10px 14px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Review
                </button>

                <button
                  onClick={() =>
                    updateStatus("Escalated")
                  }
                  style={{
                    padding: "10px 14px",
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Escalate
                </button>

                <button
                  onClick={() =>
                    updateStatus("Resolved")
                  }
                  style={{
                    padding: "10px 14px",
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Resolve
                </button>
              </div>

              {/* EVIDENCE */}

              <h3 style={{ marginTop: 30 }}>
                Evidence
              </h3>

              <div style={{ marginBottom: 20 }}>
  <textarea
    value={newNote}
    onChange={(e) => setNewNote(e.target.value)}
    placeholder="Add internal note..."
    style={{
      width: "100%",
      padding: 10,
      minHeight: 80,
      borderRadius: 6,
      border: "1px solid #ccc",
    }}
  />

  <button
    onClick={addNote}
    style={{
      marginTop: 10,
      padding: "10px 14px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: 6,
    }}
  >
    Add Note
  </button>
</div>
              {selectedEvent.evidence?.map(
                (item: any) => (
                  <div key={item.id}>
                    <strong>{item.title}</strong>

                    <p>{item.text}</p>

                    <a
                      href={item.link}
                      target="_blank"
                    >
                      Open Evidence
                    </a>
                  </div>
                )
              )}

              {/* TIMELINE */}

              <h3 style={{ marginTop: 30 }}>
                Timeline
              </h3>

              {selectedEvent.timelines?.map(
                (item: any) => (
                  <div key={item.id}>
                    <strong>{item.title}</strong>

                    <p>{item.detail}</p>
                  </div>
                )
              )}

              {/* NOTES */}

              <h3 style={{ marginTop: 30 }}>
                Notes
              </h3>

              {selectedEvent.notes?.map(
                (note: any) => (
                  <div key={note.id}>
                    <strong>
                      {note.author}
                    </strong>

                    <p>{note.text}</p>
                  </div>
                )
              )}

              {/* AUDITS */}

              <h3 style={{ marginTop: 30 }}>
                Audit History
              </h3>

              {selectedEvent.audits?.map(
                (audit: any) => (
                  <div key={audit.id}>
                    <strong>
                      {audit.actor}
                    </strong>

                    <p>
                      Changed {audit.field}
                      from "
                      {audit.oldValue}" to "
                      {audit.newValue}"
                    </p>
                  </div>
                )
              )}
            </div>
          ) : null}

          <p
            style={{
              marginTop: 20,
              color: "gray",
            }}
          >
            Escalated events:{" "}
            {escalatedCount}
          </p>
        </div>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ color: "gray" }}>
        {label}
      </p>

      <h2>{value}</h2>
    </div>
  );
}