"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SecondaryImageCarousel from '@/components/SecondaryImageCarousel';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vanta-bg p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-6 bg-vanta-header rounded-lg shadow-md mb-8">
        <div className="text-2xl font-bold text-vanta-text-dark">VantaWin</div>
        <nav className="space-x-4">
          <Link to="/" className="text-vanta-text-dark hover:text-vanta-accent transition-colors">Home</Link>
          <Link to="/about" className="text-vanta-text-dark hover:text-vanta-accent transition-colors">About</Link>
          <Link to="/dashboard" className="text-vanta-text-dark hover:text-vanta-accent transition-colors">Dashboard</Link>
        </nav>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-4xl mb-8">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold text-vanta-primary mb-4 leading-tight">
            Welcome to <span className="text-vanta-accent">VantaWin</span>
          </h1>
          <p className="text-lg text-vanta-text-light mb-6">
            Your ultimate platform for seamless experiences and powerful tools.
          </p>
          <Button className="bg-vanta-accent hover:bg-vanta-accent-dark text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300">
            Get Started
          </Button>
        </div>

        <div className="flex-1 flex justify-center">
          <Card className="w-full max-w-sm bg-vanta-card border-vanta-border shadow-xl">
            <CardHeader>
              <CardTitle className="text-vanta-text-dark">Login</CardTitle>
              <CardDescription className="text-vanta-text-light">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vanta-text-dark">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" className="bg-vanta-input border-vanta-border text-vanta-text-dark placeholder:text-vanta-text-light" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-vanta-text-dark">Password</Label>
                <Input id="password" type="password" className="bg-vanta-input border-vanta-border text-vanta-text-dark" />
              </div>
              <Button className="w-full bg-vanta-primary hover:bg-vanta-primary-dark text-white font-semibold">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <section className="w-full max-w-4xl mb-8">
        <h2 className="text-3xl font-bold text-vanta-text-dark text-center mb-6">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-vanta-card border-vanta-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-vanta-text-dark">Feature One</CardTitle>
            </CardHeader>
            <CardContent className="text-vanta-text-light">
              Description for feature one. It's amazing and useful.
            </CardContent>
          </Card>
          <Card className="bg-vanta-card border-vanta-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-vanta-text-dark">Feature Two</CardTitle>
            </CardHeader>
            <CardContent className="text-vanta-text-light">
              Description for feature two. Even better than the first!
            </CardContent>
          </Card>
          <Card className="bg-vanta-card border-vanta-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-vanta-text-dark">Feature Three</CardTitle>
            </CardHeader>
            <CardContent className="text-vanta-text-light">
              Description for feature three. You won't believe it.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-4xl mb-8">
        <h2 className="text-3xl font-bold text-vanta-text-dark text-center mb-6">Image Showcase</h2>
        <SecondaryImageCarousel />
      </section>

      <div className="mt-4 text-center text-vanta-text-light text-sm">
        <p>
          All rights reserved certified vantawin 2025 |{' '}
          <a href="#" className="text-vanta-accent hover:underline">Terms of Use</a> |{' '}
          <a href="#" className="text-vanta-accent hover:underline">Contact Us</a>
        </p>
      </div>
    </div>
  );
};

export default Index;