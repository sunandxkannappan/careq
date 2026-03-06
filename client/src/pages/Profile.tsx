import { Layout } from "@/components/Layout";
import { useUser, useUpdateUser } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Heart, Bell, Check, Stethoscope } from "lucide-react";

const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "unknown", label: "Unknown" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Divorced", label: "Divorced" },
  { value: "Widowed", label: "Widowed" },
  { value: "Separated", label: "Separated" },
  { value: "Unknown", label: "Unknown" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "Spouse", label: "Spouse" },
  { value: "Parent", label: "Parent" },
  { value: "Child", label: "Child" },
  { value: "Sibling", label: "Sibling" },
  { value: "Friend", label: "Friend" },
  { value: "Guardian", label: "Guardian" },
  { value: "Caregiver", label: "Caregiver" },
  { value: "Other", label: "Other" },
];

const POSTAL_CODE_REGEX = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/;

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  emergencyContactGender: string;
  referringPhysicianName: string;
  referringPhysicianPhone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  resultAlerts: boolean;
};

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const updateMutation = useUpdateUser();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      address: "",
      city: "",
      province: "AB",
      postalCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      emergencyContactGender: "",
      referringPhysicianName: "",
      referringPhysicianPhone: "",
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      resultAlerts: true,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        maritalStatus: user.maritalStatus || "",
        address: user.address || "",
        city: user.city || "",
        province: user.province || "AB",
        postalCode: user.postalCode || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        emergencyContactRelation: user.emergencyContactRelation || "",
        emergencyContactGender: user.emergencyContactGender || "",
        referringPhysicianName: user.referringPhysicianName || "",
        referringPhysicianPhone: user.referringPhysicianPhone || "",
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? false,
        appointmentReminders: user.appointmentReminders ?? true,
        resultAlerts: user.resultAlerts ?? true,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileForm) => {
    const postalCode = data.postalCode
      ? data.postalCode.toUpperCase().replace(/\s/g, "").replace(/^(.{3})(.{3})$/, "$1 $2")
      : "";

    updateMutation.mutate({ ...data, postalCode }, {
      onSuccess: () => {
        setSaved(true);
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
        });
        setTimeout(() => setSaved(false), 2500);
      },
    });
  };

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" data-testid="text-profile-title">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information, contact details, and communication preferences.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Patient Details</CardTitle>
                <CardDescription>Your personal and identification information.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="font-semibold text-lg" data-testid="text-profile-name">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="firstName"
                      data-testid="input-first-name"
                      {...register("firstName", { required: "First name is required" })}
                      className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-destructive" data-testid="error-first-name">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="lastName"
                      data-testid="input-last-name"
                      {...register("lastName", { required: "Last name is required" })}
                      className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-destructive" data-testid="error-last-name">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" data-testid="input-dob" {...register("dob")} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="gender" data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Controller
                      name="maritalStatus"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="maritalStatus" data-testid="select-marital-status">
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            {MARITAL_STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phn">PHN (Provincial Health Number)</Label>
                  <Input id="phn" data-testid="input-phn" value="9876 543 210" readOnly className="bg-muted/30" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How your care team can reach you.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="input-email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive" data-testid="error-email">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" data-testid="input-phone" {...register("phone")} placeholder="(555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" data-testid="input-address" {...register("address")} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" data-testid="input-city" {...register("city")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Controller
                      name="province"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="province" data-testid="select-province">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVINCES.map((p) => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      data-testid="input-postal-code"
                      placeholder="A1A 1A1"
                      {...register("postalCode", {
                        validate: (value) => {
                          if (!value) return true;
                          const normalized = value.toUpperCase().replace(/\s/g, "");
                          return POSTAL_CODE_REGEX.test(normalized) || "Must match Canadian format (e.g. T2P 1J9)";
                        },
                      })}
                      className={errors.postalCode ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.postalCode && <p className="text-xs text-destructive" data-testid="error-postal-code">{errors.postalCode.message}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Referring Physician</CardTitle>
                <CardDescription>Your referring or family doctor.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="referringPhysicianName">Physician Name</Label>
                  <Input id="referringPhysicianName" data-testid="input-referring-physician-name" {...register("referringPhysicianName")} placeholder="Dr. Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referringPhysicianPhone">Phone (optional)</Label>
                  <Input id="referringPhysicianPhone" data-testid="input-referring-physician-phone" {...register("referringPhysicianPhone")} placeholder="(555) 000-0000" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Additional Contact</CardTitle>
                <CardDescription>Someone we can reach if needed.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input id="emergencyContactName" data-testid="input-emergency-name" {...register("emergencyContactName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelation">Relationship</Label>
                    <Controller
                      name="emergencyContactRelation"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="emergencyContactRelation" data-testid="select-emergency-relation">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {RELATIONSHIP_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                    <Input id="emergencyContactPhone" data-testid="input-emergency-phone" {...register("emergencyContactPhone")} placeholder="(555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactGender">Contact Gender</Label>
                    <Controller
                      name="emergencyContactGender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="emergencyContactGender" data-testid="select-emergency-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>Choose how you'd like to receive updates from your care team.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                  <div>
                    <p className="font-medium" data-testid="text-email-notifications-label">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates and reminders via email.</p>
                  </div>
                  <Controller
                    name="emailNotifications"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-email-notifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                  <div>
                    <p className="font-medium" data-testid="text-sms-notifications-label">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get text message alerts to your phone.</p>
                  </div>
                  <Controller
                    name="smsNotifications"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-sms-notifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3 border-b border-border">
                  <div>
                    <p className="font-medium" data-testid="text-appointment-reminders-label">Appointment Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders before upcoming appointments.</p>
                  </div>
                  <Controller
                    name="appointmentReminders"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-appointment-reminders"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium" data-testid="text-result-alerts-label">Result Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when new results are available.</p>
                  </div>
                  <Controller
                    name="resultAlerts"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        data-testid="switch-result-alerts"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pb-8">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-sky-500 font-medium" data-testid="text-save-success">
                <Check className="w-4 h-4" />
                Changes saved
              </span>
            )}
            <Button
              type="submit"
              disabled={updateMutation.isPending || !isDirty}
              data-testid="button-save-profile"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
