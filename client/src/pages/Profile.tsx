import { Layout } from "@/components/Layout";
import { useUser, useUpdateUser } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { User, Mail, Bell, Clock, Shield, Accessibility, Users, Stethoscope } from "lucide-react";

const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "ON", label: "Ontario" },
  { value: "SK", label: "Saskatchewan" },
];

type ProfileForm = {
  firstName: string;
  lastName: string;
  dob: string;
  phn: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  delegateFirstName: string;
  delegateLastName: string;
  delegateEmail: string;
  delegatePhone: string;
  delegateRelationship: string;
  delegateAccessLevel: string;
  fontSize: string;
  languagePreference: string;
  interpreterRequested: boolean;
  delegateSupportRequested: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  resultAlerts: boolean;
  otpEmailEnabled: boolean;
  otpSmsEnabled: boolean;
  deleteReason: string;
};

export default function Profile() {
  const { data: user, isLoading } = useUser();
  const updateMutation = useUpdateUser();

  const { register, handleSubmit, reset, control, watch } = useForm<ProfileForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      phn: "9876 543 210",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "AB",
      postalCode: "",
      delegateFirstName: "",
      delegateLastName: "",
      delegateEmail: "",
      delegatePhone: "",
      delegateRelationship: "",
      delegateAccessLevel: "",
      fontSize: "medium",
      languagePreference: "English",
      interpreterRequested: false,
      delegateSupportRequested: false,
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      resultAlerts: true,
      otpEmailEnabled: true,
      otpSmsEnabled: true,
      deleteReason: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dob: user.dob || "",
        phn: "9876 543 210",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        province: user.province || "AB",
        postalCode: user.postalCode || "",
        delegateFirstName: "",
        delegateLastName: "",
        delegateEmail: "",
        delegatePhone: "",
        delegateRelationship: "",
        delegateAccessLevel: "",
        fontSize: "medium",
        languagePreference: "English",
        interpreterRequested: false,
        delegateSupportRequested: false,
        emailNotifications: user.emailNotifications ?? true,
        smsNotifications: user.smsNotifications ?? false,
        appointmentReminders: user.appointmentReminders ?? true,
        resultAlerts: user.resultAlerts ?? true,
        otpEmailEnabled: true,
        otpSmsEnabled: true,
        deleteReason: "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileForm) => {
    updateMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      emailNotifications: data.emailNotifications,
      smsNotifications: data.smsNotifications,
      appointmentReminders: data.appointmentReminders,
      resultAlerts: data.resultAlerts,
    });
  };
  const delegateEnabled = watch("delegateSupportRequested");

  if (isLoading) return <Layout><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-20" /></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-8 h-8 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground" data-testid="text-profile-title">Account</h1>
            </div>
            <p className="text-muted-foreground">Manage your account and communication settings for your care journey.</p>
          </div>
          <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Identification</CardTitle>
                <CardDescription>Name and health identifier details.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>First Name</Label><Input {...register("firstName")} readOnly className="bg-muted/30" /></div>
                <div><Label>Last Name</Label><Input {...register("lastName")} readOnly className="bg-muted/30" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Date of Birth</Label><Input type="date" {...register("dob")} readOnly className="bg-muted/30" /></div>
                <div><Label>PHN</Label><Input {...register("phn")} readOnly className="bg-muted/30" /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Stethoscope className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Referral</CardTitle>
                <CardDescription>Referral details from your clinic submission.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Physician</Label><Input value="Dr. Justin Case" readOnly className="bg-muted/30" /></div>
              <div><Label>Date of Referral</Label><Input value="November 12, 2025" readOnly className="bg-muted/30" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Contact</CardTitle>
                <CardDescription>How your care team can reach you.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Email</Label><Input type="email" {...register("email")} /></div>
                <div><Label>Phone</Label><Input {...register("phone")} /></div>
              </div>
              <div><Label>Address</Label><Input {...register("address")} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><Label>City</Label><Input {...register("city")} /></div>
                <div>
                  <Label>Province</Label>
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                        <SelectContent>{PROVINCES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div><Label>Postal Code</Label><Input {...register("postalCode")} /></div>
              </div>
              <div className="flex justify-end"><Button type="submit">Save Contact</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Accessibility className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>Set preferences to support your access needs.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Font Size</Label>
                  <Controller
                    name="fontSize"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div><Label>Language Preference</Label><Input {...register("languagePreference")} /></div>
              </div>
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm">Interpreter Request</span><Controller name="interpreterRequested" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex items-center justify-between py-2"><span className="text-sm">Delegate Support Request</span><Controller name="delegateSupportRequested" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex justify-end"><Button type="submit">Save Accessibility</Button></div>
            </CardContent>
          </Card>

          {delegateEnabled && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Delegate</CardTitle>
                  <CardDescription>Add a delegate who can support your care journey.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input {...register("delegateFirstName")} /></div>
                  <div><Label>Last Name</Label><Input {...register("delegateLastName")} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Email</Label><Input type="email" {...register("delegateEmail")} /></div>
                  <div><Label>Phone Number</Label><Input {...register("delegatePhone")} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Relationship</Label><Input {...register("delegateRelationship")} /></div>
                  <div>
                    <Label>Level of Access</Label>
                    <Controller
                      name="delegateAccessLevel"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Select access level" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view-only">View only</SelectItem>
                            <SelectItem value="view-and-message">View and message</SelectItem>
                            <SelectItem value="full">Full access</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end"><Button type="submit">Save Delegate</Button></div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>Choose SMS or email and your notification preferences.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm">Email Notifications</span><Controller name="emailNotifications" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm">SMS Notifications</span><Controller name="smsNotifications" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm">Appointment Reminders</span><Controller name="appointmentReminders" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex items-center justify-between py-2"><span className="text-sm">Result Alerts</span><Controller name="resultAlerts" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex justify-end"><Button type="submit">Save Preferences</Button></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage OTP settings and account deletion options.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm">Use Email for OTP</span><Controller name="otpEmailEnabled" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div className="flex items-center justify-between py-2 border-b"><span className="text-sm">Use SMS for OTP</span><Controller name="otpSmsEnabled" control={control} render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} /></div>
              <div>
                <Label>Account Deletion Reason</Label>
                <Controller
                  name="deleteReason"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off-waitlist">I'm off the waitlist</SelectItem>
                        <SelectItem value="not-comfortable">I don't feel comfortable using the portal</SelectItem>
                        <SelectItem value="duplicate">I created a duplicate account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="submit" variant="outline">Save Security</Button>
                <Button type="button" variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
}
