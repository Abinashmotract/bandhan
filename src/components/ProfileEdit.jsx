import React, { useState } from "react";
import {
  Camera,
  X,
  Plus,
  Edit2,
  Check,
  ChevronLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Phone,
  Mail,
  Heart,
  Star,
  Save,
} from "lucide-react";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    name: "Abinash Kumar",
    id: "TXX84877",
    profileImage: null,
    gender: "Male",
    religion: "Hindu",
    caste: "Rajput",
    motherTongue: "English",
    dob: "1998-03-01",
    age: 27,
    height: "5' 4\" (1.63 mts)",
    maritalStatus: "Never Married",
    city: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    disability: "Thalassemia, HIV+",
    about:
      "I am Abinash Kumar, a 27-year-old Software Professional working in the Defense sector. I hold a Master's degree in Computer Applications (MCA) and have a deep passion for technology and innovation. I am a family-oriented person from here, looking for a compatible partner to share my life with.",
    education: "MCA - Post Graduation Degree",
    school: "US College, US Degree, PG College",
    occupation: "Software Engineer",
    organization: "Indian Army, Thoughts on settling abroad",
    familyType: "Joint family",
    familyLocation: "None India",
    familyValues:
      "Family Status, Family Type, Family Value, Fathers Occupation, Mothers Occupation, Number of Brothers, Number of Sisters, Living with parents",
    email: "abinash90@gmail.com",
    phoneNumber: "+91 9142678968",
    address: "Alternate Elivila, Alternate Podde Na",
    horoscope:
      "Rashi's Solar Strength Vimshran 12 hour 1996-2 Others (3893ob) 2+3: 54m 5 Jesha, Jeeha",
    hobbies: ["Add Cooking Habits", "Add Dietary Habits", "Add Smoking Habits"],
    favorites: ["Politician", "Destination", "Cuisines(5)", "Cosplay", "Music"],
  });

  const [editPopover, setEditPopover] = useState({
    open: false,
    anchorEl: null,
    field: null,
    value: "",
    label: "",
    multiline: false,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleFieldChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleFieldChange("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditPopover = (e, field, label, value, multiline = false) => {
    setEditPopover({
      open: true,
      anchorEl: e.currentTarget,
      field,
      label,
      value,
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
            <button
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
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
            >
              Add Photos
            </button>
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
                {imagePreview || profile.profileImage ? (
                  <img
                    src={imagePreview || profile.profileImage}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ fontSize: "48px", color: "#718096" }}>👤</div>
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
              style={{
                color: "#fbbf24",
                border: "none",
                background: "transparent",
                padding: 0,
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              About Me
            </button>
            <button
              style={{
                color: "rgba(255,255,255,0.6)",
                border: "none",
                background: "transparent",
                padding: 0,
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "15px",
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
                50%
              </div>
              <p
                style={{
                  fontWeight: "600",
                  margin: "0 0 4px 0",
                  color: "#1a1a1a",
                }}
              >
                Add a few more details to make your profile rich!
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
            value={`Born: ${new Date(profile.dob).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}`}
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

        {/* About Me */}
        <Section title="About Me" subtitle="Describe yourself in a few words">
          <InfoRow
            icon={Heart}
            value={profile.about}
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

        {/* Kundli and Astro */}
        <Section
          title="Kundli and Astro"
          subtitle="These would give better chances of compatibility"
        >
          <InfoRow
            icon={Star}
            label="Horoscope Details"
            value={profile.horoscope}
            editable={true}
            field="horoscope"
            multiline={true}
          />

          <div
            style={{
              background: "#f9fafb",
              borderRadius: "12px",
              padding: "24px",
              marginTop: "16px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#666", fontSize: "13px", marginBottom: "8px" }}>
              Have is your Janampatri?
            </p>
            <p
              style={{ color: "#666", fontSize: "13px", marginBottom: "16px" }}
            >
              Use AI for My Kundli to know it all
            </p>
            <div
              style={{
                background: "#e5e7eb",
                borderRadius: "8px",
                height: "192px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "#9ca3af", margin: 0 }}>
                Kundli Chart Preview
              </p>
            </div>
          </div>
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
