import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Users, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Class {
  id: string;
  name: string;
  description: string;
  created_at: string;
  student_count?: number;
}

const StudentRanking = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data: classesData, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get student count for each class
      const classesWithCount = await Promise.all(
        classesData.map(async (cls) => {
          const { count } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', cls.id);
          
          return { ...cls, student_count: count || 0 };
        })
      );

      setClasses(classesWithCount);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Lỗi khi tải danh sách lớp');
    } finally {
      setLoading(false);
    }
  };

  const createClass = async () => {
    if (!newClassName.trim()) {
      toast.error('Vui lòng nhập tên lớp');
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .insert([{
          name: newClassName.trim(),
          description: newClassDescription.trim()
        }]);

      if (error) throw error;

      toast.success('Tạo lớp thành công!');
      setCreateDialogOpen(false);
      setNewClassName('');
      setNewClassDescription('');
      fetchClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Lỗi khi tạo lớp');
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Cao Thủ': return '👑';
      case 'Kim Cương': return '💎';
      case 'Bạch Kim': return '🥈';
      case 'Vàng': return '🥇';
      default: return '🥉';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            🏆 Bảng Xếp Hạng Học Sinh
          </h1>
          <p className="text-muted-foreground text-lg">
            Quản lý lớp học và theo dõi thành tích học sinh
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Tổng số lớp</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{classes.length}</p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Tổng học sinh</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0)}
                  </p>
                </div>
                <Star className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Lớp hoạt động</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {classes.filter(cls => (cls.student_count || 0) > 0).length}
                  </p>
                </div>
                <Trophy className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Danh sách lớp học</h2>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4" />
                Tạo lớp mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo lớp học mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin để tạo lớp học mới
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="className">Tên lớp</Label>
                  <Input
                    id="className"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ví dụ: Lớp 10A1"
                  />
                </div>
                <div>
                  <Label htmlFor="classDescription">Mô tả (tùy chọn)</Label>
                  <Input
                    id="classDescription"
                    value={newClassDescription}
                    onChange={(e) => setNewClassDescription(e.target.value)}
                    placeholder="Mô tả về lớp học"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={createClass} className="flex-1">
                    Tạo lớp
                  </Button>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1">
                    Hủy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có lớp học nào</h3>
              <p className="text-muted-foreground mb-6">
                Bắt đầu bằng cách tạo lớp học đầu tiên
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo lớp đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {cls.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {cls.student_count || 0}
                    </div>
                  </div>
                  {cls.description && (
                    <CardDescription className="line-clamp-2">
                      {cls.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Link to={`/student-ranking/${cls.id}/students`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <Users className="h-4 w-4" />
                        Quản lý học sinh
                      </Button>
                    </Link>
                    <Link to={`/student-ranking/${cls.id}/leaderboard`} className="flex-1">
                      <Button className="w-full gap-2">
                        <Trophy className="h-4 w-4" />
                        Xếp hạng
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRanking;