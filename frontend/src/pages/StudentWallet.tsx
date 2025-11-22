import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Calendar, School, Download, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getCredentialContract, getProvider, getConnectedAddress, CREDENTIAL_MANAGER_ADDRESS } from "@/utils/contract";
import { API_BASE } from "@/utils/api";
import { decryptAESHex } from "@/utils/decrypt";

interface Credential {
  id: string;
  type: string;
  issuer: string;
  title: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
  ipfsHash: string;
  raw?: any;
}

const StudentWallet = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const account = await getConnectedAddress();
        if (!account) return;

        setLoading(true);

        const provider = await getProvider();
        const contract = getCredentialContract(CREDENTIAL_MANAGER_ADDRESS, provider);

        // blockchain -> [cid1, cid2, ...]
        const cids: string[] = await contract.getCredentials(account);

        const items: Credential[] = [];

        for (const cid of cids) {
          try {
            // backend fetch -> encrypted hex
            const res = await fetch(`${API_BASE}/getCredential?cid=${cid}`);
            const json = await res.json();
            if (!json.success) continue;

            const encrypted = json.data;
            const secret = import.meta.env.VITE_AES_SECRET;

            // decrypt AES (hex -> json)
            const plain = decryptAESHex(encrypted, secret);
            const parsed = JSON.parse(plain);

            const cred = parsed.credential || {};

            items.push({
              id: cid,
              type: cred.type || "credential",
              issuer: parsed.issuer || "Unknown",
              title: cred.title || "Credential",
              issueDate: cred.issueDate || new Date().toISOString(),
              expiryDate: cred.expiryDate,
              verified: true, // for now, auto-verified
              ipfsHash: cid,
              raw: parsed
            });
          } catch (err) {
            console.error("Failed CID", cid, err);
          }
        }

        setCredentials(items);
      } catch (err) {
        console.error("Wallet load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <Card className="text-center py-12">
              <CardContent>
                <p>Loading credentials...</p>
              </CardContent>
            </Card>
          )}

          {!loading && credentials.map((credential) => (
            <Card key={credential.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{credential.title}</CardTitle>
                    <CardDescription>{credential.type}</CardDescription>

                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
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

                  {credential.verified && (
                    <Badge variant="default" className="bg-green-600">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => alert(JSON.stringify(credential.raw, null, 2))}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(credential.raw, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${credential.id}.json`;
                      a.click();
                    }}
                  >
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

          {!loading && credentials.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Credentials Yet</h3>
                <p className="text-muted-foreground">Connect your wallet to view your credentials</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentWallet;
