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
import { toast } from 'sonner';
import { Plus, ArrowLeft, Minus, Trophy, Upload, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/student-ranking">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {classInfo?.name || 'Lớp học'}
            </h1>
            <p className="text-muted-foreground">
              Quản lý học sinh và điểm số
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Học sinh</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">🥇</div>
                <div>
                  <p className="text-2xl font-bold">
                    {students.filter(s => s.rank === 'Vàng').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Hạng Vàng</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">💎</div>
                <div>
                  <p className="text-2xl font-bold">
                    {students.filter(s => s.rank === 'Kim Cương').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Kim Cương</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">👑</div>
                <div>
                  <p className="text-2xl font-bold">
                    {students.filter(s => s.rank === 'Cao Thủ').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Cao Thủ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Danh sách học sinh</h2>
          <div className="flex gap-2">
            <Link to={`/student-ranking/${classId}/leaderboard`}>
              <Button variant="outline" className="gap-2">
                <Trophy className="h-4 w-4" />
                Xem bảng xếp hạng
              </Button>
            </Link>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm học sinh
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm học sinh mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin học sinh (điểm khởi tạo: 1000)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studentName">Tên học sinh</Label>
                    <Input
                      id="studentName"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nhập tên học sinh"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar">Ảnh đại diện (tùy chọn)</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={addStudent} disabled={uploading} className="flex-1">
                      {uploading ? 'Đang thêm...' : 'Thêm học sinh'}
                    </Button>
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="flex-1">
                      Hủy
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Students Grid */}
        {students.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có học sinh nào</h3>
              <p className="text-muted-foreground mb-6">
                Bắt đầu bằng cách thêm học sinh đầu tiên
              </p>
              <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm học sinh đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <Card key={student.id} className="hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10">
                          {student.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 text-lg">
                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : ''}
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getRankColor(student.rank)} text-white border-0`}>
                          {getRankIcon(student.rank)} {student.rank}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">{student.score}</p>
                      <p className="text-sm text-muted-foreground">điểm</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateScore(student.id, -10)}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                      >
                        <Minus className="h-3 w-3" />
                        -10
                      </Button>
                      <Button
                        onClick={() => updateScore(student.id, 10)}
                        size="sm"
                        className="flex-1 gap-1"
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
                        className="flex-1"
                      >
                        -50
                      </Button>
                      <Button
                        onClick={() => updateScore(student.id, 50)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
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