"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n, useTheme } from "@/components/Providers";
import HeaderControls from "@/components/HeaderControls";
import { authService } from "@/services/auth.service";
import {
  Heart,
  Calendar,
  Package,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  PawPrint,
  Dog,
  Cat,
  Rabbit,
  Turtle,
  Bird,
  Fish,
} from "lucide-react";
import { styleText } from "util";

export default function LandingPage() {
  const { t } = useI18n();
  const router = useRouter();
  const isAuthenticated = authService.isAuthenticated();

  const handleAuthClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (isAuthenticated) {
      e.preventDefault();
      router.push("/dashboard");
    }
  };

  const features = [
    {
      icon: Calendar,
      title: t("featureEasyAppointmentTitle", "Easy Appointment Booking"),
      description: t(
        "featureEasyAppointmentDesc",
        "Schedule vet visits online at your convenience, 24/7"
      ),
    },
    {
      icon: Heart,
      title: t("featurePetHealthRecordsTitle", "Pet Health Records"),
      description: t(
        "featurePetHealthRecordsDesc",
        "Access complete medical history, vaccinations, and prescriptions"
      ),
    },
    {
      icon: Package,
      title: t("featureOnlineStoreTitle", "Online Store"),
      description: t(
        "featureOnlineStoreDesc",
        "Order pet food, medicines, and accessories with home delivery"
      ),
    },
    {
      icon: Shield,
      title: t("featureSecurePrivateTitle", "Secure & Private"),
      description: t(
        "featureSecurePrivateDesc",
        "Your pet's health data is encrypted and protected"
      ),
    },
  ];

  const benefits = [
    t("benefitViewAllPets", "View all your pets in one place"),
    t("benefitNeverMissVaccination", "Never miss a vaccination date"),
    t("benefitDownloadRecords", "Download health records and invoices"),
    t("benefitTrackGrowth", "Track your pet's weight and growth"),
    t("benefitGetReminders", "Get reminders for appointments"),
    t("benefitOrderOnline", "Order products online"),
  ];

  // Floating pet animations
  const floatingPaws = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    x: Math.random() * 100,
    size: 20 + Math.random() * 30,
    rotation: Math.random() * 360,
  }));
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Paw Prints Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingPaws.map((paw) => (
          <motion.div
            key={paw.id}
            className="absolute opacity-[0.3] dark:opacity-[0.2]"
            style={{
              left: `${paw.x}%`,
              top: "-10%",
            }}
            animate={{
              y: ["0vh", "110vh"],
              rotate: [paw.rotation, paw.rotation + 360],
              x: [0, Math.sin(paw.id) * 50],
            }}
            transition={{
              duration: paw.duration,
              delay: paw.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <PawPrint
              className="text-primary"
              size={paw.size}
              strokeWidth={2}
            />
          </motion.div>
        ))}
      </div>

      {/* Decorative Pet Icons */}
      {[
        { Icon: Dog, color: "text-amber-600 dark:text-amber-400", size: 45 },
        { Icon: Cat, color: "text-orange-500 dark:text-orange-400", size: 40 },
        { Icon: Rabbit, color: "text-pink-500 dark:text-pink-400", size: 38 },
        { Icon: Turtle, color: "text-green-600 dark:text-green-400", size: 42 },
        { Icon: Bird, color: "text-blue-500 dark:text-blue-400", size: 36 },
        { Icon: Fish, color: "text-cyan-500 dark:text-cyan-400", size: 40 },
        { Icon: Heart, color: "text-red-500 dark:text-red-400", size: 38 },
        { Icon: Dog, color: "text-purple-500 dark:text-purple-400", size: 44 },
        { Icon: Cat, color: "text-indigo-500 dark:text-indigo-400", size: 42 },
        { Icon: Rabbit, color: "text-rose-500 dark:text-rose-400", size: 40 },
        {
          Icon: Turtle,
          color: "text-emerald-600 dark:text-emerald-400",
          size: 46,
        },
        { Icon: Bird, color: "text-sky-500 dark:text-sky-400", size: 38 },
      ].map(({ Icon, color, size }, i) => (
        <motion.div
          key={`pet-${i}`}
          className={`fixed opacity-[0.3] dark:opacity-[0.2] pointer-events-none z-0 ${color}`}
          style={{
            left: `${5 + i * 8}%`,
            top: `${15 + (i % 4) * 20}%`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, i % 2 === 0 ? 8 : -8, 0],
            y: [0, i % 3 === 0 ? -25 : -15, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 5 + i * 0.4,
            delay: i * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} strokeWidth={2} />
        </motion.div>
      ))}

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 relative">
        <div className="container mx-auto px-2 py-4 md:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                style={{
                  width: "auto",
                  height: "45px",
                  filter: "hue-rotate(40deg)",
                }}
              ></img>{" "}
              <span className="md:text-2xl text-[18px] font-bold text-primary ps-1">
                {t("siteTitle", "Pawsitive Systems")}
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <HeaderControls />

              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="bg-primary text-primary-foreground px-3 md:px-6 py-2 rounded-full hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2 dark:text-white"
                  title={t("dashboard", "Dashboard")}
                >
                  <Users className="h-5 w-5" />
                  <span className="hidden md:inline">
                    {t("dashboard", "Dashboard")}
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={(e) => handleAuthClick(e, "/auth/login")}
                    className="text-foreground hover:text-primary font-medium transition-colors flex items-center gap-2 hidden md:inline"
                    title={t("signIn", "Sign In")}
                  >
                    <span className="hidden md:inline">
                      {t("signIn", "Sign In")}
                    </span>
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={(e) => handleAuthClick(e, "/auth/register")}
                    className="bg-primary text-primary-foreground px-3 md:px-6 py-2 rounded-full hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2 dark:text-white"
                    title={t("getStarted", "Get Started")}
                  >
                    <Users className="h-5 w-5" />
                    <span className="hidden md:inline">
                      {t("getStarted", "Get Started")}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div id="pets1"></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-primary">
              {t("heroTitle1", "Your Pet's Health,")}
            </span>
            <br />
            <span className="text-foreground">
              {t("heroTitle2", "All in One Place")}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t(
              "heroSubtitle",
              "Manage appointments, track vaccinations, order products, and access your pet's complete health records - anytime, anywhere."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-xl transform hover:scale-105 dark:text-white"
            >
              {t("createFreeAccount", "Create Free Account")}
              <ArrowRight className="ltr:ms-2 h-5 w-5 rtl:rotate-180 rtl:me-2" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-card text-primary border-2 border-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-accent transition-all"
            >
              {t("browseProducts", "Browse Products")}
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/20 dark:to-purple-900/20 rounded-3xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border text-center">
                <Calendar className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold mb-2 text-card-foreground">
                  {t("featureQuickBookingTitle", "Quick Booking")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(
                    "featureQuickBookingDesc",
                    "Schedule appointments in seconds"
                  )}
                </p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border text-center">
                <Heart className="h-12 w-12 mx-auto text-pink-600 dark:text-pink-400 mb-4" />
                <h3 className="font-semibold mb-2 text-card-foreground">
                  {t("featureHealthTrackingTitle", "Health Tracking")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("featureHealthTrackingDesc", "Complete medical history")}
                </p>
              </div>
              <div className="bg-card p-6 rounded-2xl shadow-lg border border-border text-center">
                <Package className="h-12 w-12 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2 text-card-foreground">
                  {t("featureOnlineStoreTitle", "Online Store")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("featureOnlineStoreDesc", "Shop with ease")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              {t("featuresHeading", "Everything You Need")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t(
                "featuresSubtitle",
                "Powerful features to keep your pet healthy and happy"
              )}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group bg-card text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto">
                  <feature.icon className="h-7 w-7 text-white mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-950/20 dark:to-purple-950/20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                {t("whyHeading", "Why Pet Owners Love Us")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t(
                  "whySubtitle",
                  "Join thousands of happy pet owners who trust us with their pet's health and well-being."
                )}
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5 mx-2" />
                    <span className="text-foreground text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-3xl p-8 shadow-2xl border border-border">
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-6 w-6 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-lg text-card-foreground mb-4 italic">
                &ldquo;
                {t(
                  "testimonialQuote",
                  "This platform has completely transformed how I manage my pets' health. Everything is so organized and easy to access!"
                )}
                &rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold me-2">
                  JD
                </div>
                <div className="ms-4">
                  <p className="font-semibold text-card-foreground">
                    {t("testimonialName", "Jessica Davis")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("testimonialMeta", "Owner of Max & Luna")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("ctaHeading", "Ready to Get Started?")}
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            {t(
              "ctaSubtitle",
              "Create your free account today and give your pet the best care they deserve."
            )}
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-50 transition-all transform hover:scale-105 shadow-xl"
          >
            {t("createFreeAccount", "Create Free Account")}
            <ArrowRight className="ltr:ms-2 h-5 w-5 rtl:rotate-180 rtl:me-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground ps-2">
                  {t("siteTitle", "Pawsitive Systems")}
                </span>
              </div>
              <p className="text-muted-foreground">
                {t(
                  "footerTagline",
                  "Your trusted partner in pet healthcare management."
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                {t("quickLinks", "Quick Links")}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/shop" className="hover:text-primary">
                    {t("shop", "Shop")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-primary">
                    {t("signIn", "Sign In")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-primary">
                    {t("getStarted", "Register")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                {t("support", "Support")}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("helpCenter", "Help Center")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("contactUs", "Contact Us")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("faq", "FAQ")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                {t("legal", "Legal")}
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("privacyPolicy", "Privacy Policy")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    {t("termsOfService", "Terms of Service")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>
              {t("copyright", "© 2025 Pawsitive Systems. All rights reserved.")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
