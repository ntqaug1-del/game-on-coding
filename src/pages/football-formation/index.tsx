import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, HelpCircle, Info, Users, Settings, Gamepad2, Download } from 'lucide-react';
import Footer from '@/components/Footer';

// Custom hooks
import { useFormation } from '@/hooks/useFormation';
import { usePlayers } from '@/hooks/usePlayers';
import { useDragPlayer } from '@/hooks/useDragPlayer';
import { useExport } from '@/hooks/useExport';
import { usePitchSettings } from '@/hooks/usePitchSettings';
import { usePlayerSettings } from '@/hooks/usePlayerSettings';

// Components
import {
  FormationControls,
  PitchSettings,
  PlayerSettings,
  ExportControls,
  PlayerList,
  FormationPitch
} from './components';

const FootballFormationBuilder: React.FC = () => {
  const navigate = useNavigate();
  const pitchRef = useRef<HTMLDivElement>(null);

  // State
  const [teamName, setTeamName] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('players'); // 'pitch', 'settings', hoặc 'players'
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [hasSeenGuide, setHasSeenGuide] = useState<boolean>(false);

  // Custom hooks
  const formation = useFormation();
  const players = usePlayers();
  const dragPlayer = useDragPlayer(players.players, players.setPlayers);
  const exportSettings = useExport();
  const pitchSettings = usePitchSettings();
  const playerSettings = usePlayerSettings();

  // Kiểm tra thiết bị di động
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1536); // 2xl breakpoint trong Tailwind
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Kiểm tra xem người dùng đã xem hướng dẫn chưa
  useEffect(() => {
    // Kiểm tra localStorage để xem người dùng đã xem hướng dẫn chưa
    const hasSeenGuideFromStorage = localStorage.getItem('footballFormationBuilder_hasSeenGuide');

    if (hasSeenGuideFromStorage === 'true') {
      setHasSeenGuide(true);
    }
    // Không hiển thị hướng dẫn mặc định
    setShowGuide(false);
  }, []);

  // Đánh dấu người dùng đã xem hướng dẫn
  const markGuideAsSeen = () => {
    localStorage.setItem('footballFormationBuilder_hasSeenGuide', 'true');
    setHasSeenGuide(true);
    setShowGuide(false);
  };

  // Xử lý thay đổi sơ đồ
  const handleFormationChange = (newFormation: string) => {
    formation.handleFormationChange(newFormation);

    // Reset vị trí của tất cả cầu thủ về mặc định theo sơ đồ mới
    const newPlayers = players.players.map(player => {
      if (!player.isStarting) return player;

      // Tìm index của cầu thủ trong nhóm vị trí của họ
      const positionIndex = players.players
          .filter(p => p.isStarting && p.position === player.position)
          .findIndex(p => p.id === player.id);

      // Lấy vị trí mặc định cho cầu thủ theo sơ đồ mới
      const defaultPos = formation.getDefaultPosition(newFormation, player.position, positionIndex);

      return {
        ...player,
        x: defaultPos.left,
        y: defaultPos.top
      };
    });

    players.setPlayers(newPlayers);
  };

  // Xử lý thay đổi số lượng cầu thủ
  const handlePlayerCountChange = (count: string) => {
    const { formation: newFormation, playerCount: newCount } = formation.handlePlayerCountChange(count);
    players.updatePlayersForFormation(newFormation, newCount);
  };

  // Xử lý tải về đội hình
  const handleDownload = () => {
    exportSettings.handleDownload(pitchRef, teamName);
  };

  // Xử lý kéo thả cầu thủ
  const handleDrag = (e: React.MouseEvent) => {
    dragPlayer.handleDrag(e, pitchRef);
  };

  // Xử lý sự kiện touch move cho thiết bị di động - cải thiện trải nghiệm
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragPlayer.dragPlayerRef.current) {
      e.preventDefault(); // Ngăn chặn cuộn trang
      const touch = e.touches[0];

      // Tạo sự kiện chuột giả lập với các thuộc tính cần thiết
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true,
        cancelable: true,
        view: window,
      });

      // @ts-ignore - Gọi hàm xử lý kéo thả với sự kiện chuột giả lập
      handleDrag(mouseEvent);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-12 dark:text-white">
            <div className="mb-4 sm:mb-6 flex justify-between items-center">
              <Button asChild variant="ghost" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200 dark:from-emerald-700 dark:to-green-800 dark:hover:from-emerald-800 dark:hover:to-green-900">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                {/* Nút trợ giúp */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                          variant="outline"
                          size="icon"
                          className="bg-white hover:bg-gray-100 text-gray-700 border-gray-200 shadow-sm dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700"
                          onClick={() => setShowGuide(true)}
                      >
                        <HelpCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mở hướng dẫn sử dụng</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Modal hướng dẫn */}
              <Dialog open={showGuide} onOpenChange={setShowGuide}>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 dark:text-gray-100 p-6 shadow-xl">
                  <DialogHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <Info className="h-6 w-6" />
                      Hướng dẫn sử dụng Football Formation Builder
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600 dark:text-gray-300 mt-2">
                      Công cụ giúp bạn dễ dàng tạo và tùy chỉnh đội hình bóng đá
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-8 py-6 overflow-y-auto pr-2">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-100 dark:border-green-900 shadow-sm">
                      <h3 className="text-lg font-bold text-green-800 dark:text-green-400 flex items-center gap-2 mb-3">
                        <span className="bg-green-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                        Quản lý cầu thủ
                      </h3>
                      <ul className="ml-10 space-y-3 list-disc text-gray-700 dark:text-gray-300">
                        <li>Thêm cầu thủ mới bằng cách nhấn nút <strong>Thêm cầu thủ</strong></li>
                        <li>Chỉnh sửa thông tin cầu thủ (số áo, tên, vị trí) trực tiếp trong danh sách</li>
                        <li>Chuyển cầu thủ giữa đội hình chính và dự bị bằng cách đánh dấu vào ô checkbox</li>
                        <li>Mỗi đội hình chỉ có thể có một thủ môn</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm">
                      <h3 className="text-lg font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 mb-3">
                        <span className="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                        Tùy chỉnh đội hình
                      </h3>
                      <ul className="ml-10 space-y-3 list-disc text-gray-700 dark:text-gray-300">
                        <li>Chọn số lượng cầu thủ (5, 7, 9 hoặc 11 người)</li>
                        <li>Chọn sơ đồ chiến thuật phù hợp (4-4-2, 4-3-3, v.v.)</li>
                        <li>Chọn màu áo cho đội bóng</li>
                        <li>Nhập tên đội và tên đội hình</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900 shadow-sm">
                      <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-400 flex items-center gap-2 mb-3">
                        <span className="bg-indigo-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                        Tùy chỉnh vị trí cầu thủ
                      </h3>
                      <ul className="ml-10 space-y-3 list-disc text-gray-700 dark:text-gray-300">
                        <li>Các cầu thủ có thể được kéo thả tự do trên sân (trừ thủ môn)</li>
                        <li>Khi thay đổi sơ đồ, vị trí cầu thủ sẽ tự động điều chỉnh</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-900 shadow-sm">
                      <h3 className="text-lg font-bold text-purple-800 dark:text-purple-400 flex items-center gap-2 mb-3">
                        <span className="bg-purple-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                        Xuất đội hình
                      </h3>
                      <ul className="ml-10 space-y-3 list-disc text-gray-700 dark:text-gray-300">
                        <li>Chọn định dạng xuất (PNG, JPEG)</li>
                        <li>Chọn độ phân giải (Thấp, Trung bình, Cao)</li>
                        <li>Nhấn nút <strong>Tải về</strong> để lưu đội hình</li>
                      </ul>
                    </div>
                  </div>

                  <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <Button
                        onClick={markGuideAsSeen}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-all dark:bg-emerald-700 dark:hover:bg-emerald-800"
                    >
                      Đã hiểu, đóng hướng dẫn
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isMobile ? (
                <div className="mb-4">
                  <Tabs defaultValue="players" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-3 dark:bg-gray-800 p-1 h-12 rounded-lg shadow-md">
                      <TabsTrigger
                          value="players"
                          className="flex items-center justify-center gap-1 text-sm font-medium h-full
                      hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-300
                      dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white
                      data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Cầu thủ
                      </TabsTrigger>
                      <TabsTrigger
                          value="settings"
                          className="flex items-center justify-center gap-1 text-sm font-medium h-full
                      hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300
                      dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white
                      data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Cài đặt
                      </TabsTrigger>
                      <TabsTrigger
                          value="pitch"
                          className="flex items-center justify-center gap-1 text-sm font-medium h-full
                      hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-300
                      dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white
                      data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        <Gamepad2 className="h-4 w-4 mr-1" />
                        Sân bóng
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pitch" className="mt-0">
                      {/* Football Field Panel */}
                      <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <CardContent className="p-2 sm:p-3 md:p-4">
                          <div className="space-y-3 md:space-y-4">
                            <div className="space-y-6">
                              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <FormationPitch
                                    pitchRef={pitchRef}
                                    startingPlayers={players.startingPlayers}
                                    formation={formation.formation}
                                    pitchClasses={pitchSettings.getPitchClasses()}
                                    pitchLinesColor={pitchSettings.getPitchLinesColor()}
                                    pitchMarkingsColor={pitchSettings.getPitchMarkingsColor()}
                                    showPitchLines={pitchSettings.showPitchLines}
                                    playerShape={playerSettings.playerShape}
                                    teamColor={playerSettings.teamColor}
                                    teamName={teamName}
                                    playerSize={playerSettings.playerSize}
                                    iconSizes={playerSettings.getPlayerIconSize()}
                                    showDetailedStats={playerSettings.showDetailedStats}
                                    hoverPlayerId={dragPlayer.hoverPlayerId}
                                    draggingPlayerId={dragPlayer.draggingPlayerId}
                                    dragPlayerRef={dragPlayer.dragPlayerRef}
                                    onMouseMove={handleDrag}
                                    onMouseUp={dragPlayer.handleDragEnd}
                                    onMouseLeave={dragPlayer.handleDragEnd}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={dragPlayer.handleDragEnd}
                                    onTouchCancel={dragPlayer.handleDragEnd}
                                    onDragStart={dragPlayer.handleDragStart}
                                    onPlayerMouseEnter={dragPlayer.handlePlayerMouseEnter}
                                    onPlayerMouseLeave={dragPlayer.handlePlayerMouseLeave}
                                    onPlayerChange={players.handlePlayerChange}
                                    getDefaultPosition={formation.getDefaultPosition}
                                />
                              </div>

                              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                  <Download className="h-4 w-4 text-emerald-500" />
                                  Xuất đội hình
                                </h3>
                                <ExportControls
                                    exportFormat={exportSettings.exportFormat}
                                    setExportFormat={exportSettings.setExportFormat}
                                    exportQuality={exportSettings.exportQuality}
                                    setExportQuality={exportSettings.setExportQuality}
                                    onDownload={handleDownload}
                                    onReset={players.resetPlayers}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="settings" className="mt-0">
                      {/* Settings Panel */}
                      <Card className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                        <CardContent className="p-2 sm:p-3 md:p-4">
                          <div className="space-y-3 md:space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên đội thi đấu</label>
                              <Input
                                  placeholder="Nhập tên đội"
                                  value={teamName}
                                  onChange={(e) => setTeamName(e.target.value)}
                                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                              />
                            </div>

                            <FormationControls
                                formation={formation.formation}
                                playerCount={formation.playerCount}
                                onFormationChange={handleFormationChange}
                                onPlayerCountChange={handlePlayerCountChange}
                            />

                            <PlayerSettings
                                playerIconSize={playerSettings.playerIconSize}
                                setPlayerIconSize={playerSettings.setPlayerIconSize}
                                playerShape={playerSettings.playerShape}
                                setPlayerShape={playerSettings.setPlayerShape}
                                showDetailedStats={playerSettings.showDetailedStats}
                                setShowDetailedStats={playerSettings.setShowDetailedStats}
                                teamColor={playerSettings.teamColor}
                                setTeamColor={playerSettings.setTeamColor}
                            />

                            <PitchSettings
                                pitchType={pitchSettings.pitchType}
                                setPitchType={pitchSettings.setPitchType}
                                pitchColor={pitchSettings.pitchColor}
                                setPitchColor={pitchSettings.setPitchColor}
                                showPitchLines={pitchSettings.showPitchLines}
                                setShowPitchLines={pitchSettings.setShowPitchLines}
                                pitchLinesColor={pitchSettings.pitchLinesColor}
                                setPitchLinesColor={pitchSettings.setPitchLinesColor}
                                pitchMarkingsColor={pitchSettings.pitchMarkingsColor}
                                setPitchMarkingsColor={pitchSettings.setPitchMarkingsColor}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="players" className="mt-0">
                      {/* Players Panel */}
                      <Card>
                        <CardContent className="p-2 sm:p-3 md:p-4">
                          <PlayerList
                              startingPlayers={players.startingPlayers}
                              substitutePlayers={players.substitutePlayers}
                              playerCount={formation.playerCount}
                              onAddPlayer={players.handleAddPlayer}
                              onPlayerChange={players.handlePlayerChange}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
            ) : (
                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                  {/* Left Panel - Tabs for Players and Settings */}
                  <div>
                    <Card>
                      <CardContent className="p-4">
                        <Tabs defaultValue="players" onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-4 dark:bg-gray-800">
                            <TabsTrigger value="players" className="flex items-center gap-2
                              data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm
                              dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white
                              hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/30 dark:hover:text-purple-300">
                              <Users className="h-4 w-4" />
                              Cầu thủ
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2
                              data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm
                              dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white
                              hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300">
                              <Settings className="h-4 w-4" />
                              Cài đặt
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="players" className="mt-0">
                            <PlayerList
                                startingPlayers={players.startingPlayers}
                                substitutePlayers={players.substitutePlayers}
                                playerCount={formation.playerCount}
                                onAddPlayer={players.handleAddPlayer}
                                onPlayerChange={players.handlePlayerChange}
                            />
                          </TabsContent>

                          <TabsContent value="settings" className="mt-0">
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên đội thi đấu</label>
                                <Input
                                    placeholder="Nhập tên đội"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                              </div>

                              <FormationControls
                                  formation={formation.formation}
                                  playerCount={formation.playerCount}
                                  onFormationChange={handleFormationChange}
                                  onPlayerCountChange={handlePlayerCountChange}
                              />

                              <PlayerSettings
                                  playerIconSize={playerSettings.playerIconSize}
                                  setPlayerIconSize={playerSettings.setPlayerIconSize}
                                  playerShape={playerSettings.playerShape}
                                  setPlayerShape={playerSettings.setPlayerShape}
                                  showDetailedStats={playerSettings.showDetailedStats}
                                  setShowDetailedStats={playerSettings.setShowDetailedStats}
                                  teamColor={playerSettings.teamColor}
                                  setTeamColor={playerSettings.setTeamColor}
                              />

                              <PitchSettings
                                  pitchType={pitchSettings.pitchType}
                                  setPitchType={pitchSettings.setPitchType}
                                  pitchColor={pitchSettings.pitchColor}
                                  setPitchColor={pitchSettings.setPitchColor}
                                  showPitchLines={pitchSettings.showPitchLines}
                                  setShowPitchLines={pitchSettings.setShowPitchLines}
                                  pitchLinesColor={pitchSettings.pitchLinesColor}
                                  setPitchLinesColor={pitchSettings.setPitchLinesColor}
                                  pitchMarkingsColor={pitchSettings.pitchMarkingsColor}
                                  setPitchMarkingsColor={pitchSettings.setPitchMarkingsColor}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Panel - Formation Display */}
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-4">
                        <FormationPitch
                            pitchRef={pitchRef}
                            startingPlayers={players.startingPlayers}
                            formation={formation.formation}
                            pitchClasses={pitchSettings.getPitchClasses()}
                            pitchLinesColor={pitchSettings.getPitchLinesColor()}
                            pitchMarkingsColor={pitchSettings.getPitchMarkingsColor()}
                            showPitchLines={pitchSettings.showPitchLines}
                            playerShape={playerSettings.playerShape}
                            teamColor={playerSettings.teamColor}
                            teamName={teamName}
                            playerSize={playerSettings.playerSize}
                            iconSizes={playerSettings.getPlayerIconSize()}
                            showDetailedStats={playerSettings.showDetailedStats}
                            hoverPlayerId={dragPlayer.hoverPlayerId}
                            draggingPlayerId={dragPlayer.draggingPlayerId}
                            dragPlayerRef={dragPlayer.dragPlayerRef}
                            onMouseMove={handleDrag}
                            onMouseUp={dragPlayer.handleDragEnd}
                            onMouseLeave={dragPlayer.handleDragEnd}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={dragPlayer.handleDragEnd}
                            onTouchCancel={dragPlayer.handleDragEnd}
                            onDragStart={dragPlayer.handleDragStart}
                            onPlayerMouseEnter={dragPlayer.handlePlayerMouseEnter}
                            onPlayerMouseLeave={dragPlayer.handlePlayerMouseLeave}
                            onPlayerChange={players.handlePlayerChange}
                            getDefaultPosition={formation.getDefaultPosition}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Download className="h-4 w-4 text-emerald-500" />
                          Xuất đội hình
                        </h3>
                        <ExportControls
                            exportFormat={exportSettings.exportFormat}
                            setExportFormat={exportSettings.setExportFormat}
                            exportQuality={exportSettings.exportQuality}
                            setExportQuality={exportSettings.setExportQuality}
                            onDownload={handleDownload}
                            onReset={players.resetPlayers}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default FootballFormationBuilder;
