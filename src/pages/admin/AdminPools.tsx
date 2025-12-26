import React, { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Loader2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPoolList from './AdminPoolList';

export default function AdminPools() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        tier: 'Bronze',
        entry_fee: '5',
        max_participants: '',
        min_participants: '', // Added min_participants
        start_time: '',
        end_time: '',
        total_pot: '',
        image_url: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!formData.start_time || !formData.end_time) {
            setMessage({ type: 'error', text: 'Please select both start and end times.' });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('pools')
                .insert({
                    name: formData.name,
                    description: formData.description,
                    tier: formData.tier,
                    entry_fee: parseInt(formData.entry_fee),
                    max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
                    min_participants: formData.min_participants ? parseInt(formData.min_participants) : null,
                    start_time: new Date(formData.start_time).toISOString(),
                    end_time: new Date(formData.end_time).toISOString(),
                    total_pot: formData.total_pot ? parseFloat(formData.total_pot) : 0,
                    image_url: formData.image_url,
                    status: 'upcoming'
                });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Pool created successfully!' });
            // Reset form
            setFormData({
                name: '',
                description: '',
                tier: 'Bronze',
                entry_fee: '5',
                max_participants: '',
                min_participants: '',
                start_time: '',
                end_time: '',
                total_pot: '',
                image_url: '',
            });

        } catch (error: any) {
            console.error('Error creating pool:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to create pool' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="create" className="w-full">
                <TabsList className="bg-white/5 border-white/10">
                    <TabsTrigger value="create">Create Pool</TabsTrigger>
                    <TabsTrigger value="manage">Manage Pools</TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                    <Card className="bg-white/5 border-white/10 text-white">
                        <CardHeader>
                            <CardTitle>Create New Pool</CardTitle>
                            <CardDescription>Setup a new betting pool for players to join.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name & Tier */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Pool Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="e.g. Weekly Premier League"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tier">Tier</Label>
                                        <Select
                                            value={formData.tier}
                                            onValueChange={(val) => handleSelectChange('tier', val)}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10">
                                                <SelectValue placeholder="Select Tier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bronze">Bronze</SelectItem>
                                                <SelectItem value="Silver">Silver</SelectItem>
                                                <SelectItem value="Gold">Gold</SelectItem>
                                                <SelectItem value="Platinum">Platinum</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe the pool rules or theme..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>

                                {/* Entry Fee, Max & Min Participants */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="entry_fee">Entry Fee</Label>
                                        <Select
                                            value={formData.entry_fee}
                                            onValueChange={(val) => handleSelectChange('entry_fee', val)}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10">
                                                <SelectValue placeholder="Select Fee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5 Vanta</SelectItem>
                                                <SelectItem value="25">25 Vanta</SelectItem>
                                                <SelectItem value="50">50 Vanta</SelectItem>
                                                <SelectItem value="100">100 Vanta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="min_participants">Min Participants</Label>
                                        <Input
                                            id="min_participants"
                                            name="min_participants"
                                            type="number"
                                            placeholder="Optional"
                                            value={formData.min_participants}
                                            onChange={handleChange}
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max_participants">Max Participants</Label>
                                        <Input
                                            id="max_participants"
                                            name="max_participants"
                                            type="number"
                                            placeholder="Optional"
                                            value={formData.max_participants}
                                            onChange={handleChange}
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Start Time</Label>
                                        <Input
                                            id="start_time"
                                            name="start_time"
                                            type="datetime-local"
                                            value={formData.start_time}
                                            onChange={handleChange}
                                            required
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">End Time</Label>
                                        <Input
                                            id="end_time"
                                            name="end_time"
                                            type="datetime-local"
                                            value={formData.end_time}
                                            onChange={handleChange}
                                            required
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                </div>

                                {/* Prize Pool & Image */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="total_pot">Initial Prize Pool (Guaranteed)</Label>
                                        <Input
                                            id="total_pot"
                                            name="total_pot"
                                            type="number"
                                            placeholder="0"
                                            value={formData.total_pot}
                                            onChange={handleChange}
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="image_url">Image URL (Optional)</Label>
                                        <Input
                                            id="image_url"
                                            name="image_url"
                                            placeholder="https://..."
                                            value={formData.image_url}
                                            onChange={handleChange}
                                            className="bg-black/20 border-white/10"
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div className={`p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                                        }`}>
                                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        {message.text}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-vanta-neon-blue hover:bg-vanta-neon-blue/80 text-black font-bold"
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Pool
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manage">
                    <AdminPoolList />
                </TabsContent>
            </Tabs>
        </div>
    );
}
