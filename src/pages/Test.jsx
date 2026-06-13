import React from "react";

export default function Test() {
  return (
    <div style={{ padding: "40px", backgroundColor: "#e0e0e0", minHeight: "100vh" }}>
      <div style={{ 
        backgroundColor: "#e0e0e0", 
        padding: "32px", 
        borderRadius: "16px",
        boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "bold", 
          color: "#333", 
          marginBottom: "16px",
          textAlign: "center"
        }}>
          ✅ App is Loading!
        </h1>
        <p style={{ 
          fontSize: "18px", 
          color: "#666",
          textAlign: "center",
          marginBottom: "24px"
        }}>
          If you can see this, your FormForge app is working correctly.
        </p>
        <div style={{
          backgroundColor: "#e0e0e0",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff",
          marginTop: "20px"
        }}>
          <p style={{ color: "#333", fontSize: "14px" }}>
            Current URL: {window.location.href}
          </p>
          <p style={{ color: "#333", fontSize: "14px", marginTop: "8px" }}>
            Pathname: {window.location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
}