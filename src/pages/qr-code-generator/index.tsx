import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { QrCode, Download, ArrowLeft, Settings2, Share2, Twitter, Facebook, Linkedin, MessageSquare } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface WiFiData {
  ssid: string;
  password: string;
  encryption: string;
}

interface ContactData {
  name: string;
  phone: string;
  email: string;
  company: string;
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

interface SMSData {
  phone: string;
  message: string;
}

const QRCodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [text, setText] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: "",
    password: "",
    encryption: "WPA"
  });
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    company: ""
  });
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    subject: "",
    body: ""
  });
  const [smsData, setSMSData] = useState<SMSData>({
    phone: "",
    message: ""
  });
  const [qrCode, setQRCode] = useState<string>("");
  const [size, setSize] = useState<number>(200);
  const [errorLevel, setErrorLevel] = useState<string>("M");

  const handleTabChange = (value: string) => {
    setText("");
    setUrl("");
    setWifiData({
      ssid: "",
      password: "",
      encryption: "WPA"
    });
    setContactData({
      name: "",
      phone: "",
      email: "",
      company: ""
    });
    setEmailData({
      to: "",
      subject: "",
      body: ""
    });
    setSMSData({
      phone: "",
      message: ""
    });
    setQRCode("");
    setActiveTab(value);
  };

  const generateQRCode = async () => {
    let data = "";
    switch (activeTab) {
      case "text":
        data = text;
        break;
      case "url":
        data = url;
        break;
      case "wifi":
        data = `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
        break;
      case "contact":
        data = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactData.name}\nTEL:${contactData.phone}\nEMAIL:${contactData.email}\nORG:${contactData.company}\nEND:VCARD`;
        break;
      case "email":
        data = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
        break;
      case "sms":
        data = `sms:${smsData.phone}?body=${encodeURIComponent(smsData.message)}`;
        break;
    }

    if (!data) return;

    try {
      const qrCodeData = await QRCode.toDataURL(data, {
        width: size,
        margin: 1,
        errorCorrectionLevel: errorLevel as QRCode.QRCodeErrorCorrectionLevel,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQRCode(qrCodeData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate QR code");
    }
  };

  useEffect(() => {
    if (text || url || contactData.name || emailData.to || smsData.phone) {
      generateQRCode();
    }
  }, [activeTab, text, url, contactData, emailData, smsData, size, errorLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4 sm:mb-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-3xl p-8 shadow-xl max-w-4xl mx-auto backdrop-blur-md border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">QR Code Generator</h1>
              <p className="text-green-700 dark:text-green-300 mt-2">Create QR codes for various types of data</p>
            </div>
          </div>

          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-green-50 dark:bg-green-900/50 p-1 rounded-xl">
                  <TabsTrigger value="text" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg">Text</TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg">URL</TabsTrigger>
                  <TabsTrigger value="wifi" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg">WiFi</TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg">Contact</TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg">Email</TabsTrigger>
                  <TabsTrigger value="sms" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-lg">SMS</TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  <TabsContent value="text" className="space-y-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Text</Label>
                      <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to encode"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">URL</Label>
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">SSID</Label>
                      <Input
                        value={wifiData.ssid}
                        onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                        placeholder="Network name"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Password</Label>
                      <Input
                        type="password"
                        value={wifiData.password}
                        onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                        placeholder="Network password"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Encryption</Label>
                      <Select
                        value={wifiData.encryption}
                        onValueChange={(value) => setWifiData({ ...wifiData, encryption: value })}
                      >
                        <SelectTrigger className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                          <SelectValue placeholder="Select encryption type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-xl">
                          <SelectItem value="WPA" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">WEP</SelectItem>
                          <SelectItem value="nopass" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">No Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Name</Label>
                      <Input
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        placeholder="Full name"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Phone</Label>
                      <Input
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        placeholder="Phone number"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Email</Label>
                      <Input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="Email address"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Company</Label>
                      <Input
                        value={contactData.company}
                        onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                        placeholder="Company name"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">To</Label>
                      <Input
                        type="email"
                        value={emailData.to}
                        onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                        placeholder="Recipient email"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Subject</Label>
                      <Input
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        placeholder="Email subject"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Body</Label>
                      <Input
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        placeholder="Email body"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sms" className="space-y-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Phone Number</Label>
                      <Input
                        value={smsData.phone}
                        onChange={(e) => setSMSData({ ...smsData, phone: e.target.value })}
                        placeholder="Recipient phone number"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Message</Label>
                      <Input
                        value={smsData.message}
                        onChange={(e) => setSMSData({ ...smsData, message: e.target.value })}
                        placeholder="SMS message"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                  </TabsContent>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Size</Label>
                      <Input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        min="100"
                        max="1000"
                        className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <Label className="text-green-700 dark:text-green-300 text-sm font-medium">Error Correction</Label>
                      <Select value={errorLevel} onValueChange={setErrorLevel}>
                        <SelectTrigger className="h-12 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 mt-2 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                          <SelectValue placeholder="Select error correction level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-xl">
                          <SelectItem value="L" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">Low (7%)</SelectItem>
                          <SelectItem value="M" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">Medium (15%)</SelectItem>
                          <SelectItem value="Q" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">Quartile (25%)</SelectItem>
                          <SelectItem value="H" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {qrCode && (
                    <div className="mt-8 p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800/50 shadow-lg">
                      <div className="flex flex-col items-center space-y-6">
                        <img src={qrCode} alt="Generated QR Code" className="rounded-xl shadow-lg" />
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                          <Button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = qrCode;
                              link.download = 'qrcode.png';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-200 gap-2 rounded-xl px-6 py-6 shadow-lg hover:shadow-xl"
                          >
                            <Download className="h-5 w-5" />
                            Download QR Code
                          </Button>
                        </div>
                        
                        <div id="share-buttons" className="hidden flex-wrap gap-4 justify-center mt-4">
                          <Button
                            onClick={() => {
                              const shareUrl = window.location.href;
                              const shareText = 'Check out this QR code I generated!';
                              let url = '';

                              url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

                              window.open(url, '_blank');
                            }}
                            className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white gap-2 rounded-xl px-4 py-2"
                          >
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </Button>
                          <Button
                            onClick={() => {
                              const shareUrl = window.location.href;
                              const shareText = 'Check out this QR code I generated!';
                              let url = '';

                              url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

                              window.open(url, '_blank');
                            }}
                            className="bg-[#1877F2] hover:bg-[#166fe5] text-white gap-2 rounded-xl px-4 py-2"
                          >
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </Button>
                          <Button
                            onClick={() => {
                              const shareUrl = window.location.href;
                              const shareText = 'Check out this QR code I generated!';
                              let url = '';

                              url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

                              window.open(url, '_blank');
                            }}
                            className="bg-[#0A66C2] hover:bg-[#004182] text-white gap-2 rounded-xl px-4 py-2"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </Button>
                          <Button
                            onClick={() => {
                              const shareUrl = window.location.href;
                              const shareText = 'Check out this QR code I generated!';
                              let url = '';

                              url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;

                              window.open(url, '_blank');
                            }}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 rounded-xl px-4 py-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
