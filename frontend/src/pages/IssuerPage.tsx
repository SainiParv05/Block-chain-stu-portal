import { Navbar } from "@/components/Navbar";
import {
  CREDENTIAL_MANAGER_ADDRESS,
  CREDENTIAL_MANAGER_ABI,
  getSigner,
  getCredentialContract,
  getConnectedAddress
} from "@/utils/contract";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Upload, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/utils/api";
import { ethers } from "ethers";

// Simple address validation
function isHexAddress(addr: string) {
  return typeof addr === "string" && /^0x[a-fA-F0-9]{40}$/.test(addr);
}

const IssuerPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    credentialType: "",
    recipientAddress: "",
    title: "",
    description: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate recipient address
      if (!isHexAddress(formData.recipientAddress)) {
        throw new Error("Invalid recipient wallet address");
      }

      // Validate issuer address
      const issuer = await getConnectedAddress();
      if (!issuer || !isHexAddress(issuer)) {
        throw new Error("Connect your issuer wallet first");
      }

      if (!isHexAddress(CREDENTIAL_MANAGER_ADDRESS)) {
        throw new Error("Invalid contract address in contract.ts");
      }

      // Prepare credential payload
      const payload = {
        studentAddress: formData.recipientAddress,
        issuerAddress: issuer,
        credential: {
          type: formData.credentialType,
          title: formData.title,
          description: formData.description,
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate
        }
      };

      // Upload to backend → returns CID
      const res = await fetch(`${API_BASE}/uploadCredential`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      const cid = json.cid;
      if (!cid) throw new Error("No CID returned from backend");

      // Blockchain transaction
      const signer = await getSigner();
      const contract = getCredentialContract(signer);

      const tx = await contract.storeCredential(
        formData.recipientAddress,
        cid
      );
      await tx.wait();

      toast({
        title: "Credential Issued Successfully",
        description: `CID: ${cid}`
      });

      // Reset form
      setFormData({
        credentialType: "",
        recipientAddress: "",
        title: "",
        description: "",
        issueDate: new Date().toISOString().split("T")[0],
        expiryDate: ""
      });

    } catch (err: any) {
      console.error("Issue error:", err);
      toast({
        title: "Issuance Failed",
        description: err?.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Issuer Portal</h1>
          <p className="text-muted-foreground">
            Issue verifiable credentials to students' wallets
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Issue New Credential</CardTitle>
                <CardDescription>
                  Fill in the details to create and issue a verifiable credential
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Credential Type */}
                  <div className="space-y-2">
                    <Label>Credential Type</Label>
                    <Select
                      value={formData.credentialType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, credentialType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="degree">Degree</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="badge">Badge</SelectItem>
                        <SelectItem value="skill">
                          Skill Certification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Recipient */}
                  <div className="space-y-2">
                    <Label>Recipient Wallet Address</Label>
                    <Input
                      placeholder="0x..."
                      value={formData.recipientAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipientAddress: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label>Credential Title</Label>
                    <Input
                      placeholder="e.g., Bachelor of Technology - CSE"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Add details about the credential..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            issueDate: e.target.value
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expiry Date (Optional)</Label>
                      <Input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expiryDate: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading ? "Issuing..." : "Issue Credential"}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssuerPage;
