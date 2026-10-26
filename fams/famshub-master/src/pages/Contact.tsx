import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Get in touch with us for inquiries, orders, or support
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* WhatsApp DM Numbers */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Call or WhatsApp</h2>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://wa.me/233546996210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    +233 546 996 210
                  </a>
                  <a
                    href="https://wa.me/233244163901"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    +233 24 416 3901
                  </a>
                  <a
                    href="https://wa.me/233595308678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    +233 059 530 8678
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Email</h2>
                </div>
                <a
                  href="mailto:famsapplehub@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  famsapplehub@gmail.com
                </a>
              </CardContent>
            </Card>
          </div>

          {/* WhatsApp Group */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Join Our WhatsApp Group</h2>
                    <p className="text-sm text-muted-foreground">Get updates on new arrivals and deals</p>
                  </div>
                </div>
                <a
                  href="https://chat.whatsapp.com/DjhZ8zyDvHt3ut6E1fhTH0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Join Group</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Follow Us on Social Media</h2>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/_famsapplehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@_famsapplehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <FaTiktok className="h-5 w-5 text-primary" />
                  <span>TikTok</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
