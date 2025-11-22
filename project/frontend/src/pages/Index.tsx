import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, CheckCircle, Lock, Wallet, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Blockchain & Web3</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          SkillChain Passport
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Decentralized & Privacy-Preserving Academic Credentials
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Your achievements—degrees, certificates, and badges—secured on blockchain. 
          Verifiable, unforgeable, and truly owned by you with privacy-preserving technology.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/student">
            <Button size="lg" className="gap-2">
              <Wallet className="h-5 w-5" />
              Student Passport
            </Button>
          </Link>
          <Link to="/issuer">
            <Button size="lg" variant="outline" className="gap-2">
              <Award className="h-5 w-5" />
              Issue Credentials
            </Button>
          </Link>
          <Link to="/verifier">
            <Button size="lg" variant="outline" className="gap-2">
              <FileCheck className="h-5 w-5" />
              Verify Credentials
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">The Solution</h2>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Student Passport Wallet</h3>
              <p className="text-muted-foreground">
                Connect your digital wallet to view and manage all your academic credentials in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Institutional Issuer Portal</h3>
              <p className="text-muted-foreground">
                Secure dashboard for universities to issue verifiable credentials directly to students' wallets.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verifier Tool</h3>
              <p className="text-muted-foreground">
                Employers can instantly verify credentials without revealing private student information.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Zero-Knowledge Proofs</h3>
              <p className="text-muted-foreground">
                Prove credentials without revealing sensitive data using advanced cryptography.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Decentralized Registry</h3>
              <p className="text-muted-foreground">
                DAO-governed registry ensures only accredited institutions can issue credentials.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expirable Credentials</h3>
              <p className="text-muted-foreground">
                Support for time-limited certifications that can be renewed or revoked as needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Connect your Web3 wallet and experience the future of academic credentials
            </p>
            <Link to="/student">
              <Button size="lg" className="gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
