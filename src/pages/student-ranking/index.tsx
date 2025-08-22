import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Plus, Users, Trophy, Star, MoreVertical, Edit, Trash2, GraduationCap, Calendar, Target } from 'lucide-react';
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
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

  const editClass = async () => {
    if (!editingClass || !newClassName.trim()) {
      toast.error('Vui lòng nhập tên lớp');
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .update({
          name: newClassName.trim(),
          description: newClassDescription.trim()
        })
        .eq('id', editingClass.id);

      if (error) throw error;

      toast.success('Cập nhật lớp thành công!');
      setEditDialogOpen(false);
      setEditingClass(null);
      setNewClassName('');
      setNewClassDescription('');
      fetchClasses();
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error('Lỗi khi cập nhật lớp');
    }
  };

  const deleteClass = async (classId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lớp này? Tất cả học sinh trong lớp cũng sẽ bị xóa.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      toast.success('Xóa lớp thành công!');
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Lỗi khi xóa lớp');
    }
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setNewClassName(cls.name);
    setNewClassDescription(cls.description || '');
    setEditDialogOpen(true);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Hệ Thống Xếp Hạng Học Sinh
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xl max-w-2xl mx-auto">
            Nền tảng quản lý lớp học hiện đại với hệ thống theo dõi thành tích và xếp hạng thông minh
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium mb-2">Tổng số lớp</p>
                  <p className="text-4xl font-bold mb-1">{classes.length}</p>
                  <p className="text-blue-200 text-sm">Lớp học đang hoạt động</p>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 font-medium mb-2">Tổng học sinh</p>
                  <p className="text-4xl font-bold mb-1">
                    {classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0)}
                  </p>
                  <p className="text-emerald-200 text-sm">Học sinh tham gia</p>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <Star className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium mb-2">Lớp có học sinh</p>
                  <p className="text-4xl font-bold mb-1">
                    {classes.filter(cls => (cls.student_count || 0) > 0).length}
                  </p>
                  <p className="text-purple-200 text-sm">Lớp đang thi đấu</p>
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                  <Trophy className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Danh sách lớp học</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Quản lý và theo dõi các lớp học của bạn</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0 px-6 py-3">
                <Plus className="h-5 w-5" />
                Tạo lớp mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Tạo lớp học mới</DialogTitle>
                <DialogDescription className="text-center">
                  Nhập thông tin để tạo lớp học mới trong hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="className" className="text-sm font-medium">Tên lớp học *</Label>
                  <Input
                    id="className"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Ví dụ: Lớp 10A1, Khoa học máy tính..."
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classDescription" className="text-sm font-medium">Mô tả lớp học</Label>
                  <Textarea
                    id="classDescription"
                    value={newClassDescription}
                    onChange={(e) => setNewClassDescription(e.target.value)}
                    placeholder="Mô tả ngắn về lớp học, mục tiêu học tập..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={createClass} className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo lớp học
                  </Button>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="flex-1 h-12">
                    Hủy bỏ
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Class Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Chỉnh sửa lớp học</DialogTitle>
              <DialogDescription className="text-center">
                Cập nhật thông tin lớp học
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="editClassName" className="text-sm font-medium">Tên lớp học *</Label>
                <Input
                  id="editClassName"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Ví dụ: Lớp 10A1, Khoa học máy tính..."
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editClassDescription" className="text-sm font-medium">Mô tả lớp học</Label>
                <Textarea
                  id="editClassDescription"
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Mô tả ngắn về lớp học, mục tiêu học tập..."
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={editClass} className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Cập nhật
                </Button>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1 h-12">
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Classes Grid */}
        {classes.length === 0 ? (
          <Card className="text-center py-20 border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Chưa có lớp học nào</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Bắt đầu hành trình giáo dục của bạn bằng cách tạo lớp học đầu tiên
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3">
                <Plus className="h-5 w-5" />
                Tạo lớp đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <Card key={cls.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                        {cls.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(cls.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openEditDialog(cls)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Chỉnh sửa lớp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteClass(cls.id)} className="gap-2 text-red-600 focus:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Xóa lớp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {cls.description && (
                    <CardDescription className="line-clamp-3 text-slate-600 dark:text-slate-400">
                      {cls.description}
                    </CardDescription>
                  )}
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{cls.student_count || 0}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Học sinh</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {cls.student_count && cls.student_count > 0 ? 'Hoạt động' : 'Chưa hoạt động'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Trạng thái</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex gap-3">
                    <Link to={`/student-ranking/${cls.id}/students`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                        <Users className="h-4 w-4" />
                        Quản lý
                      </Button>
                    </Link>
                    <Link to={`/student-ranking/${cls.id}/leaderboard`} className="flex-1">
                      <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0">
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