import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, School, Download, Eye } from "lucide-react";
import { useState } from "react";

interface Credential {
  id: string;
  type: string;
  issuer: string;
  title: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
  ipfsHash: string;
}

const StudentWallet = () => {
  const [credentials] = useState<Credential[]>([
    {
      id: "1",
      type: "degree",
      issuer: "Tech University",
      title: "Bachelor of Technology - Computer Science",
      issueDate: "2023-05-15",
      verified: true,
      ipfsHash: "QmX1234...",
    },
    {
      id: "2",
      type: "certificate",
      issuer: "Blockchain Academy",
      title: "Smart Contract Development",
      issueDate: "2024-01-20",
      expiryDate: "2025-01-20",
      verified: true,
      ipfsHash: "QmY5678...",
    },
    {
      id: "3",
      type: "badge",
      issuer: "Web3 Hackathon",
      title: "DeFi Innovation Winner",
      issueDate: "2024-03-10",
      verified: true,
      ipfsHash: "QmZ9012...",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Credential Passport</h1>
          <p className="text-muted-foreground">
            Your decentralized, verifiable academic achievements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Credentials
              </CardTitle>
              <div className="text-3xl font-bold">{credentials.length}</div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified
              </CardTitle>
              <div className="text-3xl font-bold text-green-600">
                {credentials.filter((c) => c.verified).length}
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
              <div className="text-3xl font-bold text-primary">
                {credentials.filter((c) => !c.expiryDate || new Date(c.expiryDate) > new Date()).length}
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6">
          {credentials.map((credential) => (
            <Card key={credential.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="mb-2">{credential.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mb-3">
                        <School className="h-4 w-4" />
                        {credential.issuer}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Issued: {new Date(credential.issueDate).toLocaleDateString()}
                        </div>
                        {credential.expiryDate && (
                          <div className="flex items-center gap-1">
                            Expires: {new Date(credential.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {credential.verified && (
                    <Badge variant="default" className="bg-green-600">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <code className="text-xs text-muted-foreground ml-auto">
                    IPFS: {credential.ipfsHash}
                  </code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {credentials.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Credentials Yet</h3>
              <p className="text-muted-foreground">
                Connect your wallet to view your credentials
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default StudentWallet;
