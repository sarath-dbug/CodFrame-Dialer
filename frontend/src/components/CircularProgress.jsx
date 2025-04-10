import { useState } from "react";
import {
  Box,
  Typography,
  Tooltip
} from "@mui/material";


const CircularProgress = ({ successRate, totalCalls }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const successDashArray = (circumference * successRate) / 100;
  const failureDashArray = (circumference * (100 - successRate)) / 100;
  const gap = 5;
  
  const successCount = Math.round((totalCalls * successRate) / 100);
  const failureCount = totalCalls - successCount;
  
  const [hoveredSegment, setHoveredSegment] = useState(null);

  return (
    <Box sx={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Success Segment */}
        <Tooltip title={`${successCount} successful calls`} arrow>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#10B981"
            strokeWidth={hoveredSegment === "success" ? 22 : 20}
            strokeDasharray={`${successDashArray - gap} ${circumference - successDashArray + gap}`}
            strokeDashoffset={circumference * 0.25}
            transform="rotate(-90 90 90)"
            onMouseEnter={() => setHoveredSegment("success")}
            onMouseLeave={() => setHoveredSegment(null)}
            style={{
              opacity: hoveredSegment === null || hoveredSegment === "success" ? 1 : 0.7,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        </Tooltip>

        {/* Failure Segment */}
        <Tooltip title={`${failureCount} unsuccessful calls`} arrow>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#EF4444"
            strokeWidth={hoveredSegment === "failure" ? 22 : 20}
            strokeDasharray={`${failureDashArray - gap} ${circumference - failureDashArray + gap}`}
            strokeDashoffset={-(successDashArray - gap) + circumference * 0.25}
            transform="rotate(-90 90 90)"
            onMouseEnter={() => setHoveredSegment("failure")}
            onMouseLeave={() => setHoveredSegment(null)}
            style={{
              opacity: hoveredSegment === null || hoveredSegment === "failure" ? 1 : 0.7,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        </Tooltip>
      </svg>

      {/* Center Text */}
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        pointerEvents: "none"
      }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0F172A" }}>
          {successRate}%
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          Success Rate
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgress;