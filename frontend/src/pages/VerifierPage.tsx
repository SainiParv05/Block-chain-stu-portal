import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, AlertCircle, Shield, Calendar, School } from "lucide-react";
import { useState } from "react";
import { API_BASE } from "@/utils/api";

const VerifierPage = () => {
  const [credentialId, setCredentialId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Build mock Privado-style proof (replace with real proof generation)
      const proof = {
        proofId: "0x" + Math.floor(Math.random() * 1e9).toString(16),
        revealed: { degree: "B.Tech" },
        hidden: "ZK_PROOF_SIMULATED",
        timestamp: Date.now(),
        cid: credentialId // credentialId should be CID (Qm...) for this demo
      };

      const res = await fetch(`${API_BASE}/verifyProof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proof)
      });

      const j = await res.json();
      setResult(j);
    } catch (e) {
      console.error(e);
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
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
                      {result.verified ? (
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

                    {result.verified && result.revealed && (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Badge variant="outline" className="mt-1">
                              {result.revealed.type || "degree"}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <Badge className="mt-1 bg-green-600">Active</Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Title</Label>
                          <p className="font-medium mt-1">{result.revealed.title || "Credential"}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <School className="h-3 w-3" />
                              Issuer
                            </Label>
                            <p className="font-medium mt-1">{result.revealed.issuer || "Issuer"}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Holder</Label>
                            <p className="font-medium mt-1 font-mono text-sm">
                              {result.revealed.holder || credentialId}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* right column unchanged */}
        </div>
      </main>
    </div>
  );
};

export default VerifierPage;
