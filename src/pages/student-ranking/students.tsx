import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Plus, ArrowLeft, Minus, Trophy, Upload, Users, MoreVertical, Edit, Trash2, Star, Medal, Crown, TrendingUp } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  avatar_url: string | null;
  score: number;
  rank: string;
  created_at: string;
}

interface Class {
  id: string;
  name: string;
  description: string;
}

const StudentManagement = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
      fetchStudents();
    }
  }, [classId]);

  const fetchClassInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (error) throw error;
      setClassInfo(data);
    } catch (error) {
      console.error('Error fetching class info:', error);
      toast.error('Lỗi khi tải thông tin lớp');
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('score', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Lỗi khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('student-avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('student-avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const addStudent = async () => {
    if (!newStudentName.trim()) {
      toast.error('Vui lòng nhập tên học sinh');
      return;
    }

    setUploading(true);
    try {
      let avatarUrl = null;
      
      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile);
        if (!avatarUrl) {
          toast.error('Lỗi khi tải ảnh lên');
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('students')
        .insert([{
          name: newStudentName.trim(),
          avatar_url: avatarUrl,
          class_id: classId,
          score: 1000
        }]);

      if (error) throw error;

      toast.success('Thêm học sinh thành công!');
      setAddDialogOpen(false);
      setNewStudentName('');
      setSelectedFile(null);
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Lỗi khi thêm học sinh');
    } finally {
      setUploading(false);
    }
  };

  const editStudent = async () => {
    if (!editingStudent || !newStudentName.trim()) {
      toast.error('Vui lòng nhập tên học sinh');
      return;
    }

    setUploading(true);
    try {
      let avatarUrl = editingStudent.avatar_url;
      
      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile);
        if (!avatarUrl) {
          toast.error('Lỗi khi tải ảnh lên');
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('students')
        .update({
          name: newStudentName.trim(),
          avatar_url: avatarUrl
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      toast.success('Cập nhật học sinh thành công!');
      setEditDialogOpen(false);
      setEditingStudent(null);
      setNewStudentName('');
      setSelectedFile(null);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Lỗi khi cập nhật học sinh');
    } finally {
      setUploading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      toast.success('Xóa học sinh thành công!');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Lỗi khi xóa học sinh');
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setNewStudentName(student.name);
    setEditDialogOpen(true);
  };

  const updateScore = async (studentId: string, scoreChange: number) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const newScore = Math.max(0, student.score + scoreChange);

      const { error } = await supabase
        .from('students')
        .update({ score: newScore })
        .eq('id', studentId);

      if (error) throw error;

      toast.success(`${scoreChange > 0 ? 'Cộng' : 'Trừ'} điểm thành công!`);
      fetchStudents();
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Lỗi khi cập nhật điểm');
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Cao Thủ': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Kim Cương': return 'bg-gradient-to-r from-blue-400 to-cyan-400';
      case 'Bạch Kim': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'Vàng': return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      default: return 'bg-gradient-to-r from-orange-400 to-red-400';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center gap-6 mb-10">
          <Link to="/student-ranking">
            <Button variant="outline" size="icon" className="h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {classInfo?.name || 'Lớp học'}
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Quản lý học sinh và điểm số - Hệ thống xếp hạng thông minh
            </p>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 font-medium mb-1">Tổng học sinh</p>
                  <p className="text-3xl font-bold">{students.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 font-medium mb-1">Hạng Vàng</p>
                  <p className="text-3xl font-bold">{students.filter(s => s.rank === 'Vàng').length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Medal className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 font-medium mb-1">Kim Cương</p>
                  <p className="text-3xl font-bold">{students.filter(s => s.rank === 'Kim Cương').length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 font-medium mb-1">Cao Thủ</p>
                  <p className="text-3xl font-bold">{students.filter(s => s.rank === 'Cao Thủ').length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Crown className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Danh sách học sinh</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Quản lý và theo dõi điểm số của các học sinh</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/student-ranking/${classId}/leaderboard`}>
              <Button variant="outline" className="gap-2 h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <Trophy className="h-5 w-5" />
                Xem bảng xếp hạng
              </Button>
            </Link>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-5 w-5" />
                  Thêm học sinh
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">Thêm học sinh mới</DialogTitle>
                  <DialogDescription className="text-center">
                    Thêm học sinh vào lớp với điểm khởi tạo 1000 điểm
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName" className="text-sm font-medium">Tên học sinh *</Label>
                    <Input
                      id="studentName"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nhập họ và tên học sinh"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-sm font-medium">Ảnh đại diện</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="h-12"
                    />
                    <p className="text-xs text-slate-500">Tùy chọn - Kích thước khuyến nghị: 400x400px</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={addStudent} disabled={uploading} className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      {uploading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang thêm...
                        </div>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm học sinh
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="flex-1 h-12">
                      Hủy bỏ
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Student Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Chỉnh sửa học sinh</DialogTitle>
              <DialogDescription className="text-center">
                Cập nhật thông tin học sinh
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="editStudentName" className="text-sm font-medium">Tên học sinh *</Label>
                <Input
                  id="editStudentName"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Nhập họ và tên học sinh"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAvatar" className="text-sm font-medium">Ảnh đại diện mới</Label>
                <Input
                  id="editAvatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="h-12"
                />
                <p className="text-xs text-slate-500">Tùy chọn - Để trống nếu không muốn thay đổi ảnh</p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={editStudent} disabled={uploading} className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang cập nhật...
                    </div>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Cập nhật
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="flex-1 h-12">
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Students Grid */}
        {students.length === 0 ? (
          <Card className="text-center py-20 border-0 shadow-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
            <CardContent>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Chưa có học sinh nào</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Bắt đầu thêm học sinh để tạo cuộc thi xếp hạng hấp dẫn
              </p>
              <Button onClick={() => setAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3">
                <Plus className="h-5 w-5" />
                Thêm học sinh đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student, index) => (
              <Card key={student.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        {/* Enhanced Avatar with prominent styling */}
                        <Avatar className="h-16 w-16 border-4 border-white shadow-xl ring-4 ring-blue-100 dark:ring-blue-900 transition-all duration-300 group-hover:ring-blue-200 dark:group-hover:ring-blue-800">
                          <AvatarImage src={student.avatar_url || ''} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                            {student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* Position Badge */}
                        {index < 3 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                            {index + 1}
                          </div>
                        )}
                        {/* Rank position indicator for top 3 */}
                        {index < 3 && (
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-2xl">
                            {['🥇', '🥈', '🥉'][index]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors truncate">
                          {student.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`${getRankColor(student.rank)} text-white border-0 shadow-md text-xs`}>
                            {getRankIcon(student.rank)} {student.rank}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openEditDialog(student)} className="gap-2">
                          <Edit className="h-4 w-4" />
                          Chỉnh sửa học sinh
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteStudent(student.id)} className="gap-2 text-red-600 focus:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Xóa học sinh
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-6">
                  {/* Score Display */}
                  <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg py-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {student.score}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">điểm tích lũy</p>
                  </div>

                  {/* Score Control Buttons */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateScore(student.id, -10)}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                        -10
                      </Button>
                      <Button
                        onClick={() => updateScore(student.id, 10)}
                        size="sm"
                        className="flex-1 gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Plus className="h-3 w-3" />
                        +10
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateScore(student.id, -50)}
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      >
                        -50
                      </Button>
                      <Button
                        onClick={() => updateScore(student.id, 50)}
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      >
                        +50
                      </Button>
                    </div>
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

export default StudentManagement;