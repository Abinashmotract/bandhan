import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  X,
  Plus,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Phone,
  Mail,
  Heart,
  Star,
  Save,
  Trash2,
} from "lucide-react";
import { API_BASE_URL } from "../utils/api";

// Extract base URL from API_BASE_URL (remove /api)
const getBaseUrl = () => {
  const baseUrl = API_BASE_URL.replace('/api', '');
  return baseUrl || 'http://localhost:3000';
};

const ProfileEdit = ({
  editingProfile = {},
  onBackToMatches,
  onSaveProfile,
  onCancelEdit,
  onProfileFieldChange,
  onProfileImageChange,
  onRemoveProfileImage,
  onPhotosUpload,
}) => {
  const photosInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("about");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Helper function to get image URL - handles both full URLs and filenames
  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
      // If already a full URL (from API response)
      if (image.startsWith('http://') || image.startsWith('https://')) {
        // Check if it already has the correct format
        // Backend returns: http://host/uploads/filename or http://host/uploads/filename
        return image;
      }
      // If it's a relative path starting with /uploads or uploads/
      if (image.startsWith('/uploads/') || image.startsWith('uploads/')) {
        const baseUrl = getBaseUrl();
        return `${baseUrl}/${image.startsWith('/') ? image.slice(1) : image}`;
      }
      // If it doesn't start with /uploads, assume it's just a filename
      const baseUrl = getBaseUrl();
      return `${baseUrl}/uploads/${image}`;
    }
    return null;
  };

  // Helper function to calculate age from dob
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  // Map user data to profile format for display
  const mapUserDataToProfile = (userData) => {
    if (!userData) return {};
    
    // Get proper image URL - handle both full URLs and relative paths
    let profileImageUrl = null;
    if (userData.profileImage) {
      // Backend may return full URL or just filename
      if (typeof userData.profileImage === 'string') {
        if (userData.profileImage.startsWith('http')) {
          profileImageUrl = userData.profileImage;
        } else {
          profileImageUrl = getImageUrl(userData.profileImage);
        }
      }
    }
    
    return {
      name: userData.name || "",
      id: userData.customId || "Loading...", // Only use backend customId
      profileImage: profileImageUrl,
      gender: userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : "",
      religion: userData.religion || "",
      caste: userData.caste || "",
      motherTongue: Array.isArray(userData.motherTongue) 
        ? userData.motherTongue.join(", ") 
        : (userData.motherTongue || ""),
      dob: formatDate(userData.dob),
      age: calculateAge(userData.dob),
      height: userData.height || "",
      maritalStatus: userData.maritalStatus 
        ? userData.maritalStatus.split("_").map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(" ")
        : "",
      city: userData.city || "",
      state: userData.state || "",
      country: userData.country || "India",
      location: userData.location || "",
      about: userData.about || "",
      education: userData.education || userData.highestQualification || "",
      school: userData.fieldOfStudy || "",
      occupation: userData.occupation || "",
      organization: userData.industry || "",
      familyType: userData.familyType || "",
      familyLocation: userData.nativePlace || "",
      familyValues: `Family Type: ${userData.familyType || "N/A"}, Family Income: ${userData.familyIncome || "N/A"}, Father's Occupation: ${userData.fatherOccupation || "N/A"}, Mother's Occupation: ${userData.motherOccupation || "N/A"}, Brothers: ${userData.brothers || 0}, Sisters: ${userData.sisters || 0}`,
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || "",
      address: userData.location || "",
      hobbies: userData.hobbies || [],
      interests: userData.interests || [],
      favorites: userData.interests || [],
    };
  };

  const [profile, setProfile] = useState(() => mapUserDataToProfile(editingProfile));
  const [editPopover, setEditPopover] = useState({
    open: false,
    anchorEl: null,
    field: null,
    value: "",
    label: "",
    multiline: false,
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Update profile when editingProfile prop changes
  useEffect(() => {
    const mappedProfile = mapUserDataToProfile(editingProfile);
    setProfile(mappedProfile);
    
    // If editingProfile has a new image URL (starts with http), clear the preview
    // This allows preview to show during upload, then switch to URL when API responds
    if (editingProfile?.profileImage && 
        typeof editingProfile.profileImage === 'string' && 
        editingProfile.profileImage.startsWith('http')) {
      setImagePreview(null); // Clear preview in favor of server URL
    }
    
    // Reset photo index if photos array changes
    if (editingProfile?.photos) {
      const photoCount = editingProfile.photos.length;
      if (currentPhotoIndex >= photoCount && photoCount > 0) {
        setCurrentPhotoIndex(0);
      }
    }
  }, [editingProfile]);

  const handleFieldChange = (field, value) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    // Notify parent component of the change
    if (onProfileFieldChange) {
      // Handle preferences fields specially
      if (field === "ageRange") {
        // Parse age range from "min - max" format
        const parts = value.split("-").map(s => s.trim());
        const min = parseInt(parts[0]) || null;
        const max = parseInt(parts[1]) || null;
        if (onProfileFieldChange) {
          onProfileFieldChange("preferences", {
            ...editingProfile?.preferences,
            ageRange: { min, max }
          });
        }
        return;
      }
      
      // Handle other preference fields
      if (["locationPref", "religion", "educationPref", "profession", "maritalStatusPref"].includes(field)) {
        if (onProfileFieldChange) {
          onProfileFieldChange("preferences", {
            ...editingProfile?.preferences,
            [field]: value
          });
        }
        return;
      }
      
      // Map field back to user data format if needed
      let apiField = field;
      let apiValue = value;
      
      // For motherTongue, keep it as string (will be converted to array on save)
      // This allows users to edit it as comma-separated string
      if (field === "motherTongue") {
        apiField = "motherTongue";
        apiValue = value; // Keep as string, will be parsed on save
      } else if (field === "school") {
        apiField = "fieldOfStudy";
      } else if (field === "organization") {
        apiField = "industry";
      } else if (field === "familyLocation") {
        apiField = "nativePlace";
      }
      
      onProfileFieldChange(apiField, apiValue);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && onProfileImageChange) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Call parent handler to upload image
      onProfileImageChange(e);
    }
  };

  const openEditPopover = (e, field, label, value, multiline = false) => {
    // For ageRange, format the value for display/editing
    let displayValue = value;
    if (field === "ageRange" && editingProfile?.preferences?.ageRange) {
      displayValue = `${editingProfile.preferences.ageRange.min || ''} - ${editingProfile.preferences.ageRange.max || ''}`;
    }
    
    setEditPopover({
      open: true,
      anchorEl: e.currentTarget,
      field,
      label,
      value: displayValue,
      multiline,
    });
  };

  const closeEditPopover = () => {
    setEditPopover({
      open: false,
      anchorEl: null,
      field: null,
      value: "",
      label: "",
      multiline: false,
    });
  };

  const saveEdit = () => {
    if (editPopover.field) {
      handleFieldChange(editPopover.field, editPopover.value);
    }
    closeEditPopover();
  };

  const Section = ({ title, subtitle, children }) => (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h5
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "4px",
          }}
        >
          {title}
        </h5>
        {subtitle && (
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    editable,
    field,
    multiline,
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "16px",
        padding: "12px",
        borderRadius: "8px",
        background: "#fafafa",
        position: "relative",
      }}
    >
      <Icon
        size={18}
        style={{
          color: "#999",
          marginTop: "2px",
          marginRight: "12px",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        {label && (
          <small
            style={{
              display: "block",
              color: "#666",
              fontSize: "12px",
              marginBottom: "4px",
            }}
          >
            {label}
          </small>
        )}
        <p style={{ margin: 0, color: "#1a1a1a", fontSize: "14px" }}>{value}</p>
      </div>
      {editable && (
        <button
          onClick={(e) => openEditPopover(e, field, label, value, multiline)}
          style={{
            background: "white",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            padding: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
            e.currentTarget.style.borderColor = "#d0d0d0";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e0e0e0";
          }}
        >
          <Edit2 size={14} color="#666" />
        </button>
      )}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={onBackToMatches || onCancelEdit}
            style={{
              background: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px",
              marginRight: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: 0,
              color: "#1a1a1a",
            }}
          >
            Edit Profile
          </h1>
        </div>

        {/* Profile Header Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
            }}
          >
            <label
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "white",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
            >
              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (onPhotosUpload && e.target.files.length > 0) {
                    onPhotosUpload(e);
                  }
                }}
                style={{ display: "none" }}
              />
              Add Photos
            </label>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ position: "relative", marginRight: "24px" }}>
              <div
                style={{
                  width: "128px",
                  height: "128px",
                  borderRadius: "50%",
                  background: "#4a5568",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "4px solid rgba(255,255,255,0.1)",
                }}
              >
                {(imagePreview || profile.profileImage || getImageUrl(editingProfile?.profileImage)) ? (
                  <img
                    src={imagePreview || profile.profileImage || getImageUrl(editingProfile?.profileImage)}
                    alt="Profile"
                    onError={(e) => {
                      // Fallback if image fails to load
                      console.error("Image failed to load:", e.target.src);
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
                {!imagePreview && !profile.profileImage && !getImageUrl(editingProfile?.profileImage) && (
                  <div style={{ fontSize: "48px", color: "#718096", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>👤</div>
                )}
              </div>
              <label
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  background: "#dc2626",
                  borderRadius: "50%",
                  padding: "10px",
                  cursor: "pointer",
                  border: "3px solid #1a202c",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#b91c1c";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#dc2626";
                }}
              >
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "4px",
                }}
              >
                {profile.name}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
                ID - {profile.id}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <button
              onClick={() => setActiveTab("about")}
              style={{
                color: activeTab === "about" ? "#fbbf24" : "rgba(255,255,255,0.6)",
                border: "none",
                background: "transparent",
                padding: 0,
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
                transition: "color 0.2s",
              }}
            >
              About Me
            </button>
            <button
              onClick={() => setActiveTab("looking")}
              style={{
                color: activeTab === "looking" ? "#fbbf24" : "rgba(255,255,255,0.6)",
                border: "none",
                background: "transparent",
                padding: 0,
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
                transition: "color 0.2s",
              }}
            >
              Looking For
            </button>
          </div>
        </div>

        {/* Verification Banner */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            border: "1px solid #dbeafe",
            boxShadow: "0 1px 3px rgba(59,130,246,0.1)",
          }}
        >
          <div
            style={{
              background: "#3b82f6",
              borderRadius: "50%",
              padding: "8px",
              marginRight: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: "600", color: "#1a1a1a" }}>
              Verify your profile using selfie
            </span>{" "}
            <span style={{ color: "#666", fontSize: "14px" }}>
              to assure others you are genuine and get a badge!
            </span>
          </div>
        </div>

        {/* Photos Carousel */}
        {editingProfile?.photos && editingProfile.photos.length > 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h5
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                Your Photos ({editingProfile.photos.length})
              </h5>
            </div>
            
            <div
              style={{
                position: "relative",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#f5f5f5",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Previous Button */}
              {editingProfile.photos.length > 1 && (
                <button
                  onClick={() => {
                    setCurrentPhotoIndex((prev) =>
                      prev === 0 ? editingProfile.photos.length - 1 : prev - 1
                    );
                  }}
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 2,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.8)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <ChevronLeft size={24} color="white" />
                </button>
              )}

              {/* Current Photo */}
              {editingProfile.photos[currentPhotoIndex] && (
                <img
                  src={getImageUrl(editingProfile.photos[currentPhotoIndex])}
                  alt={`Photo ${currentPhotoIndex + 1}`}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "contain",
                    display: "block",
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.style.display = "none";
                  }}
                />
              )}

              {/* Next Button */}
              {editingProfile.photos.length > 1 && (
                <button
                  onClick={() => {
                    setCurrentPhotoIndex((prev) =>
                      prev === editingProfile.photos.length - 1 ? 0 : prev + 1
                    );
                  }}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 2,
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.8)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  <ChevronRight size={24} color="white" />
                </button>
              )}
            </div>

            {/* Photo Thumbnails & Dots */}
            {editingProfile.photos.length > 1 && (
              <div style={{ marginTop: "16px" }}>
                {/* Thumbnail Strip */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    paddingBottom: "8px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#ccc transparent",
                  }}
                >
                  {editingProfile.photos.map((photo, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      style={{
                        minWidth: "80px",
                        height: "80px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          currentPhotoIndex === index
                            ? "3px solid #ec4899"
                            : "3px solid transparent",
                        transition: "all 0.2s",
                        opacity: currentPhotoIndex === index ? 1 : 0.7,
                      }}
                      onMouseOver={(e) => {
                        if (currentPhotoIndex !== index) {
                          e.currentTarget.style.opacity = "1";
                          e.currentTarget.style.transform = "scale(1.05)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentPhotoIndex !== index) {
                          e.currentTarget.style.opacity = "0.7";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <img
                        src={getImageUrl(photo)}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Dot Indicators */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "12px",
                  }}
                >
                  {editingProfile.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      style={{
                        width: currentPhotoIndex === index ? "24px" : "8px",
                        height: "8px",
                        borderRadius: "4px",
                        border: "none",
                        background:
                          currentPhotoIndex === index ? "#ec4899" : "#d1d5db",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Completion */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "16px",
            borderLeft: "4px solid #dc2626",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#dc2626",
                  marginBottom: "8px",
                }}
              >
                {editingProfile?.profileCompletion ?? 0}%
              </div>
              <p
                style={{
                  fontWeight: "600",
                  margin: "0 0 4px 0",
                  color: "#1a1a1a",
                }}
              >
                {editingProfile?.profileCompletion >= 100
                  ? "Your profile is complete!"
                  : "Add a few more details to make your profile rich!"}
              </p>
              <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
                Complete your profile
              </p>
            </div>
          </div>
        </div>

        {/* Basic Details */}
        <Section
          title="Basic Details"
          subtitle="Brief outline of personal information"
        >
          <InfoRow
            icon={Users}
            value={`${profile.gender} • ${profile.religion} • ${profile.caste}`}
          />
          <InfoRow
            icon={Heart}
            label="Mother Tongue"
            value={profile.motherTongue}
            editable={true}
            field="motherTongue"
          />
          <InfoRow
            icon={MapPin}
            value={`${profile.city}, ${profile.state}, ${profile.country}`}
          />
          <InfoRow
            icon={Users}
            value={`Age: ${profile.age} • ${profile.height}`}
          />
          <InfoRow
            icon={Heart}
            value={profile.dob ? `Born: ${new Date(profile.dob).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}` : "Date of birth not set"}
          />
          <InfoRow icon={Heart} value={profile.maritalStatus} />

          {profile.disability && (
            <div
              style={{
                background: "#fef3c7",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "16px",
                border: "1px solid #fde68a",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  margin: "0 0 8px 0",
                  color: "#92400e",
                }}
              >
                <span style={{ fontWeight: "600" }}>Disability:</span>{" "}
                {profile.disability}
              </p>
              <button
                style={{
                  color: "#dc2626",
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Add
              </button>
            </div>
          )}
        </Section>

        {/* Tab Content */}
        {activeTab === "about" && (
          <>
            {/* About Me */}
            <Section title="About Me" subtitle="Describe yourself in a few words">
              <InfoRow
                icon={Heart}
                value={profile.about || "Tell others about yourself..."}
                editable={true}
                field="about"
                multiline={true}
              />
            </Section>

            {/* Education */}
        <Section
          title="Education"
          subtitle="Showcase your educational qualification"
        >
          <InfoRow
            icon={GraduationCap}
            label="Highest Qualification"
            value={profile.education}
            editable={true}
            field="education"
          />
          <InfoRow
            icon={GraduationCap}
            label="School Name"
            value={profile.school}
            editable={true}
            field="school"
          />
        </Section>

        {/* Career */}
        <Section
          title="Career"
          subtitle="Give an overview of your professional life"
        >
          <InfoRow
            icon={Briefcase}
            label="Occupation"
            value={profile.occupation}
            editable={true}
            field="occupation"
          />
          <InfoRow
            icon={Briefcase}
            label="Organization"
            value={profile.organization}
            editable={true}
            field="organization"
          />
        </Section>

        {/* Family */}
        <Section
          title="Family"
          subtitle="Information about your family members, values and background"
        >
          <InfoRow icon={Users} value={profile.familyLocation} />
          <p style={{ fontSize: "13px", marginTop: "12px", color: "#666" }}>
            {profile.familyValues}
          </p>
        </Section>

        {/* Contact */}
        <Section
          title="Contact"
          subtitle="Details that would help profiles get in touch with you"
        >
          <InfoRow
            icon={Mail}
            value={profile.email}
            editable={true}
            field="email"
          />
          <InfoRow
            icon={Phone}
            value={profile.phoneNumber}
            editable={true}
            field="phoneNumber"
          />
          <p style={{ color: "#666", fontSize: "13px", marginTop: "12px" }}>
            {profile.address}
          </p>
        </Section>

            {/* Lifestyle & Interests */}
            <Section
              title="My Lifestyle & Interests"
              subtitle="Help your matches get an idea of your lifestyle activities"
            >
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "12px",
                color: "#1a1a1a",
              }}
            >
              Habits
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {profile.hobbies.map((hobby, idx) => (
                <button
                  key={idx}
                  style={{
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#1a1a1a",
              }}
            >
              My Favourites
            </p>
            <p
              style={{ color: "#666", fontSize: "12px", marginBottom: "12px" }}
            >
              Add more things from your perfect portfolio!
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {profile.favorites.map((fav, idx) => (
                <button
                  key={idx}
                  style={{
                    background: "white",
                    border: "1px solid #fecaca",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Heart size={14} />
                  {fav}
                </button>
              ))}
            </div>
          </div>
        </Section>
          </>
        )}

        {activeTab === "looking" && (
          <Section 
            title="Looking For" 
            subtitle="Describe your ideal partner preferences"
          >
            <InfoRow
              icon={Heart}
              label="Age Range (Min - Max)"
              value={editingProfile?.preferences?.ageRange 
                ? `${editingProfile.preferences.ageRange.min || 'N/A'} - ${editingProfile.preferences.ageRange.max || 'N/A'}`
                : "Not set"}
              editable={true}
              field="ageRange"
              multiline={false}
            />
            <InfoRow
              icon={MapPin}
              label="Location Preference"
              value={editingProfile?.preferences?.locationPref || editingProfile?.preferences?.location || "Not set"}
              editable={true}
              field="locationPref"
            />
            <InfoRow
              icon={Users}
              label="Religion Preference"
              value={editingProfile?.preferences?.religion || "Not set"}
              editable={true}
              field="religion"
            />
            <InfoRow
              icon={GraduationCap}
              label="Education Preference"
              value={editingProfile?.preferences?.educationPref || editingProfile?.preferences?.education || "Not set"}
              editable={true}
              field="educationPref"
            />
            <InfoRow
              icon={Briefcase}
              label="Profession Preference"
              value={editingProfile?.preferences?.profession || (editingProfile?.preferences?.occupationPref ? editingProfile.preferences.occupationPref.join(", ") : "Not set")}
              editable={true}
              field="profession"
            />
            <InfoRow
              icon={Heart}
              label="Marital Status Preference"
              value={editingProfile?.preferences?.maritalStatusPref || editingProfile?.preferences?.maritalStatus || "Not set"}
              editable={true}
              field="maritalStatusPref"
            />
          </Section>
        )}

        {/* Save Button */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            marginTop: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <button
            onClick={onSaveProfile}
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: "12px",
              width: "100%",
              padding: "16px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(236,72,153,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Edit Popover */}
      {editPopover.open && (
        <>
          <div
            onClick={closeEditPopover}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 999,
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              zIndex: 1000,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
                Edit {editPopover.label || "Field"}
              </h3>
              <button
                onClick={closeEditPopover}
                style={{
                  background: "#f5f5f5",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {editPopover.multiline ? (
              <textarea
                value={editPopover.value}
                onChange={(e) =>
                  setEditPopover((prev) => ({ ...prev, value: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  minHeight: "120px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ec4899";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                }}
              />
            ) : (
              <input
                type="text"
                value={editPopover.value}
                onChange={(e) =>
                  setEditPopover((prev) => ({ ...prev, value: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#ec4899";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={closeEditPopover}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  background: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f5f5f5";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(236,72,153,0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileEdit;
