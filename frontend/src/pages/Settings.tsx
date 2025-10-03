import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, User, Bell, Shield, Palette, Building2, CreditCard, FileImage } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CompanyProfileForm from '@/components/CompanyProfileForm';
import BankAccountForm from '@/components/BankAccountForm';
import SignatureUpload from '@/components/SignatureUpload';

const Settings: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getPageTitle = () => {
    switch (currentPath) {
      case '/settings/profile':
        return 'Profile Settings';
      case '/company-profile':
        return 'Company Profile';
      case '/settings/bank-accounts':
        return 'Bank Accounts';
      case '/settings/signature':
        return 'Digital Signature';
      case '/settings/notifications':
        return 'Notification Settings';
      case '/settings/security':
        return 'Security Settings';
      case '/settings/appearance':
        return 'Appearance Settings';
      default:
        return 'Settings';
    }
  };

  const getPageIcon = () => {
    switch (currentPath) {
      case '/settings/profile':
        return <User className="w-5 h-5" />;
      case '/company-profile':
        return <Building2 className="w-5 h-5" />;
      case '/settings/bank-accounts':
        return <CreditCard className="w-5 h-5" />;
      case '/settings/signature':
        return <FileImage className="w-5 h-5" />;
      case '/settings/notifications':
        return <Bell className="w-5 h-5" />;
      case '/settings/security':
        return <Shield className="w-5 h-5" />;
      case '/settings/appearance':
        return <Palette className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const renderSettingsContent = () => {
    switch (currentPath) {
      case '/settings/profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user?.firstName || ''} placeholder="Enter your first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.lastName || ''} placeholder="Enter your last name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} placeholder="Enter your email" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        );

      case '/company-profile':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Company Profiles</h2>
                <p className="text-gray-600">Manage your business information and company details</p>
              </div>
              <Button onClick={() => window.location.href = '/company-profile?new=true'}>
                + Add New Company
              </Button>
            </div>
            <CompanyProfileForm />
          </div>
        );

      case '/settings/bank-accounts':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Bank Accounts</h2>
                <p className="text-gray-600">Manage your bank accounts and payment methods</p>
              </div>
              <Button onClick={() => window.location.href = '/settings/bank-accounts?new=true'}>
                + Add New Bank Account
              </Button>
            </div>
            <BankAccountForm />
          </div>
        );

      case '/settings/signature':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Digital Signatures</h2>
                <p className="text-gray-600">Upload and manage your digital signatures</p>
              </div>
              <Button onClick={() => window.location.href = '/settings/signature?new=true'}>
                + Add New Signature
              </Button>
            </div>
            <SignatureUpload />
          </div>
        );

      case '/settings/notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Invoice Reminders</Label>
                  <p className="text-sm text-gray-600">Get reminded about pending invoices</p>
                </div>
                <Switch />
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        );

      case '/settings/security':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Change Password</Label>
                <div className="space-y-2 mt-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="mt-2">Update Password</Button>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case '/settings/appearance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span>Light</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span>Dark</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <span>System</span>
                  </Button>
                </div>
              </div>
              <div>
                <Label>Language</Label>
                <select className="w-full mt-2 p-2 border rounded-md">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Select a settings category from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center">
            {getPageIcon()}
            <h1 className="text-3xl font-bold text-gray-900 ml-3">{getPageTitle()}</h1>
          </div>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        {renderSettingsContent()}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
