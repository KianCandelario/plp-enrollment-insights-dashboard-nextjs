import LandingPage from "./components/LandingPage";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-20 bg-gradient-to-r">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#D6EFD8] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#80AF81,rgba(255,255,255,0))]"></div>
        <LandingPage></LandingPage>
      </main>
    </>
  );
}
