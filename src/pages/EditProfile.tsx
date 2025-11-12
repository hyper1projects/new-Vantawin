"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, session } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(undefined);
  const [gender, setGender] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  React.useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, username, avatar_url, mobile_number, date_of_birth, gender')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile data.');
    } else if (data) {
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setUsername(data.username || '');
      setAvatarUrl(data.avatar_url || '');
      setMobileNumber(data.mobile_number || '');
      setDateOfBirth(data.date_of_birth ? new Date(data.date_of_birth) : undefined);
      setGender(data.gender || '');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        username: username,
        avatar_url: avatarUrl,
        mobile_number: mobileNumber,
        date_of_birth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
        gender: gender,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (!newPassword) {
      toast.error('New password cannot be empty.');
      return;
    }

    // Supabase client-side password update requires re-authentication for security
    // For simplicity, this example assumes the user is already authenticated.
    // In a real app, you might prompt for current password or use a server-side function.
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error updating password:', error);
      toast.error(`Failed to update password: ${error.message}`);
    } else {
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const getTabTriggerClasses = (tabValue: string) => {
    // Removed py-1.5 and added h-10, flex, items-center, justify-center
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 flex items-center justify-center";
    const activeClasses = "data-[state=active]:bg-vanta-blue-dark data-[state=active]:text-vanta-text-light data-[state=active]:shadow-sm";
    const inactiveClasses = "text-vanta-text-light/60 hover:text-vanta-text-light";

    return `${baseClasses} ${activeTab === tabValue ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-vanta-text-light">Edit Profile</h1>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-vanta-blue-medium rounded-xl p-1 mb-8">
          <TabsTrigger value="profile" className={getTabTriggerClasses('profile')}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className={getTabTriggerClasses('security')}>
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className={getTabTriggerClasses('notifications')}>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-vanta-blue-medium border-vanta-blue-light text-vanta-text-light">
            <CardHeader>
              <CardTitle className="text-vanta-text-light">Personal Information</CardTitle>
              <CardDescription className="text-vanta-text-light/70">
                Update your personal details and profile picture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light",
                          !dateOfBirth && "text-vanta-text-light/70"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-vanta-blue-medium border-vanta-blue-light text-vanta-text-light">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="w-full bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-vanta-blue-medium border-vanta-blue-light text-vanta-text-light">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-vanta-green hover:bg-vanta-green/90 text-vanta-text-dark">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-vanta-blue-medium border-vanta-blue-light text-vanta-text-light">
            <CardHeader>
              <CardTitle className="text-vanta-text-light">Security Settings</CardTitle>
              <CardDescription className="text-vanta-text-light/70">
                Manage your account password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-vanta-blue-dark border-vanta-blue-light text-vanta-text-light"
                  />
                </div>
                <Button type="submit" className="w-full bg-vanta-green hover:bg-vanta-green/90 text-vanta-text-dark">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-vanta-blue-medium border-vanta-blue-light text-vanta-text-light">
            <CardHeader>
              <CardTitle className="text-vanta-text-light">Notification Settings</CardTitle>
              <CardDescription className="text-vanta-text-light/70">
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Notification settings will be implemented here.</p>
                {/* Placeholder for notification settings */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfile;