import {
  Card,
  CircularProgress,
  Box,
  Typography,
  CardContent,
} from "@mui/material";
import React from "react";

export default function VerifyPercent() {
  return (
    <Card className="mb-4">
      <CardContent>
        <div className="row align-items-center">
          <div className="col-lg-10">
            <b style={{ color: "#51375f" }}>Complete Your Profile</b>
            <p className="mb-0">
              Verify your profile and get matched with more people
            </p>
          </div>
          <div className="col-lg-2">
            <Box
              sx={{ position: "relative", display: "inline-flex" }}
              className=""
            >
              <CircularProgress variant="determinate" value={100} color="secondary" />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ color: "text.secondary" }}
                >
                  {`30%`}
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
