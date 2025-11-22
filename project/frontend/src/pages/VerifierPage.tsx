import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, AlertCircle, Shield, Calendar, School } from "lucide-react";
import { useState } from "react";

interface VerificationResult {
  valid: boolean;
  credential: {
    title: string;
    issuer: string;
    holder: string;
    issueDate: string;
    expiryDate?: string;
    type: string;
  } | null;
}

const VerifierPage = () => {
  const [credentialId, setCredentialId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    // Simulate verification
    setTimeout(() => {
      // Mock verification result
      const mockResult: VerificationResult = {
        valid: true,
        credential: {
          title: "Bachelor of Technology - Computer Science",
          issuer: "Tech University",
          holder: "0x1234...5678",
          issueDate: "2023-05-15",
          type: "degree",
        },
      };

      setResult(mockResult);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Credential Verifier</h1>
          <p className="text-muted-foreground">
            Verify the authenticity of academic credentials on the blockchain
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verify Credential</CardTitle>
                <CardDescription>
                  Enter the credential ID or wallet address to verify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credentialId">Credential ID or Wallet Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="credentialId"
                      placeholder="0x... or QmX..."
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleVerify}
                      disabled={!credentialId || loading}
                      className="gap-2"
                    >
                      <Search className="h-4 w-4" />
                      {loading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>

                {result && (
                  <div className="mt-6 p-6 border rounded-lg bg-card">
                    <div className="flex items-center gap-3 mb-6">
                      {result.valid ? (
                        <>
                          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Credential Verified</h3>
                            <p className="text-sm text-muted-foreground">
                              This credential is valid and authentic
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                            <XCircle className="h-8 w-8 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Invalid Credential</h3>
                            <p className="text-sm text-muted-foreground">
                              This credential could not be verified
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {result.valid && result.credential && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Badge variant="outline" className="mt-1">
                              {result.credential.type}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Badge className="mt-1 bg-green-600">Active</Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Title</Label>
                          <p className="font-medium mt-1">{result.credential.title}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <School className="h-3 w-3" />
                              Issuer
                            </Label>
                            <p className="font-medium mt-1">{result.credential.issuer}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Holder</Label>
                            <p className="font-medium mt-1 font-mono text-sm">
                              {result.credential.holder}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Issue Date
                            </Label>
                            <p className="font-medium mt-1">
                              {new Date(result.credential.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                          {result.credential.expiryDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                              <p className="font-medium mt-1">
                                {new Date(result.credential.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {!result && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Blockchain Verification</p>
                      <p className="text-sm text-muted-foreground">
                        Credentials are verified against on-chain records
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Issuer Validation</p>
                      <p className="text-sm text-muted-foreground">
                        Confirms the issuer is registered and accredited
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Revocation Check</p>
                      <p className="text-sm text-muted-foreground">
                        Ensures the credential has not been revoked
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Verify</CardTitle>
                <CardDescription>Use these sample credentials for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-mono text-xs"
                  onClick={() => setCredentialId("0x1234567890abcdef")}
                >
                  0x1234...cdef
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-mono text-xs"
                  onClick={() => setCredentialId("QmX1234567890abcdefgh")}
                >
                  QmX123...efgh
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">Zero-Knowledge Proofs</p>
                  <p className="text-muted-foreground">
                    Verify credentials without revealing sensitive data
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Selective Disclosure</p>
                  <p className="text-muted-foreground">
                    Students control what information to share
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifierPage;
