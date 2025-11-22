import { NavLink } from "@/components/NavLink";
import { Shield, Wallet, FileCheck, Award } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SkillChain</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <NavLink
                to="/student"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-primary"
              >
                <Wallet className="h-4 w-4" />
                My Passport
              </NavLink>
              
              <NavLink
                to="/issuer"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-primary"
              >
                <Award className="h-4 w-4" />
                Issue Credential
              </NavLink>
              
              <NavLink
                to="/verifier"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-primary"
              >
                <FileCheck className="h-4 w-4" />
                Verify
              </NavLink>
            </div>
          </div>
          
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
};
