"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSettingService } from '@/lib/services/setting.service';
import { isApiSuccess } from '@/lib/utils';
import { Setting } from '@/types/interfaces';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';

const AdminSettings = () => {
    const { GET_SETTINGS,
        UPDATE_MENTORSHIP_CLEANUP,
        UPDATE_JOBPOST_CLEANUP,
        UPDATE_MENTORSHIP_SETTINGS,
        UPDATE_SCHEDULE_SETTINGS
    } = useSettingService();
    const [settings, setSettings] = useState<Setting>();
    const [draftSettings, setDraftSettings] = useState<Partial<Setting>>({});
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState<{
        [key: string]: boolean;
    }>({
        mentorshipCleanup: false,
        jobPostCleanup: false,
        mentorshipSettings: false,
        scheduleSettings: false,
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await GET_SETTINGS();
            if (isApiSuccess(res) && res.data) {
                setSettings(res.data);
            }
        } catch (error) {
            toast.error("Error fetching settings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSettings();
    }, [])

    const handleUpdate = async (section: string, value: any) => {
        if (!value || value <= 0) {
            toast.error("Giá trị phải lớn hơn 0");
            return;
        }
        try {
            let res = null;
            switch (section) {
                case "mentorshipCleanup":
                    res = await UPDATE_MENTORSHIP_CLEANUP(value);
                    break;
                case "jobPostCleanup":
                    res = await UPDATE_JOBPOST_CLEANUP(value);
                    break;
                case "mentorshipSettings":
                    res = await UPDATE_MENTORSHIP_SETTINGS(value);
                    break;
                case "scheduleSettings":
                    res = await UPDATE_SCHEDULE_SETTINGS(value);
                    break;
            }
            if (res && isApiSuccess(res)) {
                toast.success("Cập nhật thành công");
                fetchSettings();
                setEditMode((prev) => ({ ...prev, [section]: false }));
            }
        } catch (error) {
            toast.error("Error updating settings");
        }
    }

    if (!settings) return <div>Loading...</div>;
    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
                </div>
            </div>

            {/* Mentorship Cleanup */}
            <Card>
                <CardHeader>
                    <CardTitle>Tự động từ chối yêu cầu mentor</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 items-center">
                    <label className="min-w-[150px]">Thời gian (giờ):</label>
                    <Input
                        type="number"
                        value={
                            editMode.mentorshipCleanup
                                ? draftSettings.mentorshipCleanup?.totalHours ?? ""
                                : settings.mentorshipCleanup.totalHours
                        }
                        disabled={!editMode.mentorshipCleanup}
                        onChange={(e) =>
                            setDraftSettings((prev) => ({
                                ...prev,
                                mentorshipCleanup: {
                                    totalHours: Number(e.target.value),
                                },
                            }))
                        }
                    />
                    {editMode.mentorshipCleanup ? (
                        <>
                            <Button
                                onClick={() =>
                                    handleUpdate(
                                        "mentorshipCleanup",
                                        draftSettings.mentorshipCleanup?.totalHours
                                    )
                                }
                                disabled={loading}
                            >
                                Lưu
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setEditMode((prev) => ({
                                        ...prev,
                                        mentorshipCleanup: false,
                                    }))
                                }
                            >
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                setDraftSettings((prev) => ({
                                    ...prev,
                                    mentorshipCleanup: { ...settings.mentorshipCleanup },
                                }));
                                setEditMode((prev) => ({ ...prev, mentorshipCleanup: true }));
                            }}
                        >
                            Sửa
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Job Post Cleanup */}
            <Card>
                <CardHeader>
                    <CardTitle>Tự động chuyển trạng thái bài tuyển dụng</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 items-center">
                    <label className="min-w-[150px]">Thời gian (giờ):</label>
                    <Input
                        type="number"
                        value={
                            editMode.jobPostCleanup
                                ? draftSettings.jobPostCleanup?.totalHours ?? ""
                                : settings.jobPostCleanup.totalHours
                        }
                        disabled={!editMode.jobPostCleanup}
                        onChange={(e) =>
                            setDraftSettings((prev) => ({
                                ...prev,
                                jobPostCleanup: {
                                    totalHours: Number(e.target.value),
                                },
                            }))
                        }
                    />
                    {editMode.jobPostCleanup ? (
                        <>
                            <Button
                                onClick={() =>
                                    handleUpdate(
                                        "jobPostCleanup",
                                        draftSettings.jobPostCleanup?.totalHours
                                    )
                                }
                                disabled={loading}
                            >
                                Lưu
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setEditMode((prev) => ({
                                        ...prev,
                                        jobPostCleanup: false,
                                    }))
                                }
                            >
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                setDraftSettings((prev) => ({
                                    ...prev,
                                    jobPostCleanup: { ...settings.jobPostCleanup },
                                }));
                                setEditMode((prev) => ({ ...prev, jobPostCleanup: true }));
                            }}
                        >
                            Sửa
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Mentorship Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Giới hạn tạo yêu cầu cho cố vấn</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 items-center">
                    <label className="min-w-[150px]">Số yêu cầu / ngày:</label>
                    <Input
                        type="number"
                        value={
                            editMode.mentorshipSettings
                                ? draftSettings.mentorshipSettings?.maxPerDay ?? ""
                                : settings.mentorshipSettings.maxPerDay
                        }
                        disabled={!editMode.mentorshipSettings}
                        onChange={(e) =>
                            setDraftSettings((prev) => ({
                                ...prev,
                                mentorshipSettings: {
                                    maxPerDay: Number(e.target.value),
                                },
                            }))
                        }
                    />
                    {editMode.mentorshipSettings ? (
                        <>
                            <Button
                                onClick={() =>
                                    handleUpdate(
                                        "mentorshipSettings",
                                        draftSettings.mentorshipSettings?.maxPerDay
                                    )
                                }
                                disabled={loading}
                            >
                                Lưu
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setEditMode((prev) => ({
                                        ...prev,
                                        mentorshipSettings: false,
                                    }))
                                }
                            >
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                setDraftSettings((prev) => ({
                                    ...prev,
                                    mentorshipSettings: { ...settings.mentorshipSettings },
                                }));
                                setEditMode((prev) => ({ ...prev, mentorshipSettings: true }));
                            }}
                        >
                            Sửa
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Schedule Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Giới hạn cố vấn nhận yêu cầu</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2 items-center">
                    <label className="min-w-[150px]">Số yêu cầu / ngày:</label>
                    <Input
                        type="number"
                        value={
                            editMode.scheduleSettings
                                ? draftSettings.scheduleSettings?.maxPerDay ?? ""
                                : settings.scheduleSettings.maxPerDay
                        }
                        disabled={!editMode.scheduleSettings}
                        onChange={(e) =>
                            setDraftSettings((prev) => ({
                                ...prev,
                                scheduleSettings: {
                                    maxPerDay: Number(e.target.value),
                                },
                            }))
                        }
                    />
                    {editMode.scheduleSettings ? (
                        <>
                            <Button
                                onClick={() =>
                                    handleUpdate(
                                        "scheduleSettings",
                                        draftSettings.scheduleSettings?.maxPerDay
                                    )
                                }
                                disabled={loading}
                            >
                                Lưu
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setEditMode((prev) => ({
                                        ...prev,
                                        scheduleSettings: false,
                                    }))
                                }
                            >
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                setDraftSettings((prev) => ({
                                    ...prev,
                                    scheduleSettings: { ...settings.scheduleSettings },
                                }));
                                setEditMode((prev) => ({ ...prev, scheduleSettings: true }));
                            }}
                        >
                            Sửa
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );

};
export default AdminSettings