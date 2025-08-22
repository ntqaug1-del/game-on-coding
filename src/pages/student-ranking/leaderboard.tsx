import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Trophy, Medal, Crown, Star, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const Leaderboard = () => {
  const { classId } = useParams<{ classId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-orange-400" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-orange-300 to-red-400';
      default: return 'bg-muted';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const topThree = students.slice(0, 3);
  const others = students.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center gap-6 mb-10">
          <Link to={`/student-ranking/${classId}/students`}>
            <Button variant="outline" size="icon" className="h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Bảng Xếp Hạng
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {classInfo?.name || 'Lớp học'} • {students.length} học sinh tham gia
            </p>
          </div>
        </div>

        {students.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có học sinh nào</h3>
              <p className="text-muted-foreground mb-6">
                Thêm học sinh để bắt đầu cuộc thi
              </p>
              <Link to={`/student-ranking/${classId}/students`}>
                <Button className="gap-2">
                  <Users className="h-4 w-4" />
                  Quản lý học sinh
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Top 3 Podium */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <CardHeader>
                <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Top 3 Xuất Sắc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 2nd Place */}
                  {topThree[1] && (
                    <div className="order-1 md:order-1">
                      <Card className={`${getPositionBg(2)} text-white border-0 shadow-lg`}>
                        <CardContent className="p-6 text-center">
                          <div className="flex justify-center mb-3">
                            {getPositionIcon(2)}
                          </div>
                           <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-white shadow-2xl ring-4 ring-white/50">
                             <AvatarImage src={topThree[1].avatar_url || ''} className="object-cover" />
                             <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                               {topThree[1].name.charAt(0).toUpperCase()}
                             </AvatarFallback>
                           </Avatar>
                          <h3 className="font-bold text-lg mb-2">{topThree[1].name}</h3>
                          <p className="text-2xl font-bold mb-2">{topThree[1].score}</p>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {getRankIcon(topThree[1].rank)} {topThree[1].rank}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* 1st Place (Center, Higher) */}
                  {topThree[0] && (
                    <div className="order-2 md:order-2 md:-mt-8">
                      <Card className={`${getPositionBg(1)} text-white border-0 shadow-xl`}>
                        <CardContent className="p-8 text-center">
                          <div className="flex justify-center mb-4">
                            {getPositionIcon(1)}
                          </div>
                           <Avatar className="h-24 w-24 mx-auto mb-4 border-6 border-white shadow-2xl ring-6 ring-yellow-300/50 transform hover:scale-110 transition-all duration-300">
                             <AvatarImage src={topThree[0].avatar_url || ''} className="object-cover" />
                             <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white text-2xl font-bold">
                               {topThree[0].name.charAt(0).toUpperCase()}
                             </AvatarFallback>
                           </Avatar>
                          <h3 className="font-bold text-xl mb-3">{topThree[0].name}</h3>
                          <p className="text-3xl font-bold mb-3">{topThree[0].score}</p>
                          <Badge className="bg-white/20 text-white border-white/30 text-lg px-3 py-1">
                            {getRankIcon(topThree[0].rank)} {topThree[0].rank}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] && (
                    <div className="order-3 md:order-3">
                      <Card className={`${getPositionBg(3)} text-white border-0 shadow-lg`}>
                        <CardContent className="p-6 text-center">
                          <div className="flex justify-center mb-3">
                            {getPositionIcon(3)}
                          </div>
                           <Avatar className="h-20 w-20 mx-auto mb-3 border-4 border-white shadow-2xl ring-4 ring-white/50">
                             <AvatarImage src={topThree[2].avatar_url || ''} className="object-cover" />
                             <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-xl font-bold">
                               {topThree[2].name.charAt(0).toUpperCase()}
                             </AvatarFallback>
                           </Avatar>
                          <h3 className="font-bold text-lg mb-2">{topThree[2].name}</h3>
                          <p className="text-2xl font-bold mb-2">{topThree[2].score}</p>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {getRankIcon(topThree[2].rank)} {topThree[2].rank}
                          </Badge>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Complete Leaderboard Table */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Bảng Xếp Hạng Đầy Đủ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16">Hạng</TableHead>
                      <TableHead>Học sinh</TableHead>
                      <TableHead className="text-center">Cấp bậc</TableHead>
                      <TableHead className="text-center">Điểm</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow 
                        key={student.id} 
                        className={`${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950' : ''} hover:bg-muted/50`}
                      >
                        <TableCell className="text-center font-medium">
                          <div className="flex justify-center">
                            {getPositionIcon(index + 1)}
                          </div>
                        </TableCell>
                         <TableCell>
                           <div className="flex items-center gap-4">
                             <Avatar className={`${index < 3 ? 'h-14 w-14 border-4 border-white shadow-xl ring-4' : 'h-12 w-12 border-2 border-white shadow-lg ring-2'} ${
                               index === 0 ? 'ring-yellow-300/50' : 
                               index === 1 ? 'ring-gray-300/50' : 
                               index === 2 ? 'ring-orange-300/50' : 
                               'ring-blue-100 dark:ring-blue-900'
                             } transition-all duration-300 hover:scale-110`}>
                               <AvatarImage src={student.avatar_url || ''} className="object-cover" />
                               <AvatarFallback className={`${
                                 index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                                 index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                                 index === 2 ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                                 'bg-gradient-to-br from-blue-500 to-purple-600'
                               } text-white font-bold ${index < 3 ? 'text-lg' : 'text-base'}`}>
                                 {student.name.charAt(0).toUpperCase()}
                               </AvatarFallback>
                             </Avatar>
                             <div>
                               <p className={`font-bold ${index < 3 ? 'text-lg' : 'text-base'}`}>{student.name}</p>
                               <p className="text-sm text-muted-foreground">
                                 Tham gia từ {new Date(student.created_at).toLocaleDateString('vi-VN')}
                               </p>
                             </div>
                           </div>
                         </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getRankColor(student.rank)} text-white border-0`}>
                            {getRankIcon(student.rank)} {student.rank}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xl font-bold text-primary">{student.score}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Rank Distribution */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Phân bố cấp bậc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Cao Thủ'].map((rank) => {
                    const count = students.filter(s => s.rank === rank).length;
                    const percentage = students.length > 0 ? (count / students.length * 100).toFixed(1) : '0';
                    
                    return (
                      <div key={rank} className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-3xl mb-2">{getRankIcon(rank)}</div>
                        <p className="font-semibold">{rank}</p>
                        <p className="text-2xl font-bold text-primary">{count}</p>
                        <p className="text-sm text-muted-foreground">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;