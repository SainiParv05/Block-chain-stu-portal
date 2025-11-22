import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Send, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const IssuerPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    credentialType: "",
    recipientAddress: "",
    title: "",
    description: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate credential issuance
    setTimeout(() => {
      toast({
        title: "Credential Issued Successfully",
        description: "The credential has been issued to the student's wallet",
      });
      setLoading(false);
      // Reset form
      setFormData({
        credentialType: "",
        recipientAddress: "",
        title: "",
        description: "",
        issueDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
      });
    }, 2000);
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
                  <div className="space-y-2">
                    <Label htmlFor="credentialType">Credential Type</Label>
                    <Select
                      value={formData.credentialType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, credentialType: value })
                      }
                    >
                      <SelectTrigger id="credentialType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="degree">Degree</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="badge">Badge</SelectItem>
                        <SelectItem value="skill">Skill Certification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientAddress">Recipient Wallet Address</Label>
                    <Input
                      id="recipientAddress"
                      placeholder="0x..."
                      value={formData.recipientAddress}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientAddress: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Credential Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Bachelor of Technology - Computer Science"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add details about the credential..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input
                        id="issueDate"
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, issueDate: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          setFormData({ ...formData, expiryDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">Upload Supporting Document</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, PNG, JPG (max. 5MB)
                      </p>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium mb-1">Fill Details</p>
                    <p className="text-sm text-muted-foreground">
                      Enter credential information and recipient wallet
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium mb-1">Encrypt & Store</p>
                    <p className="text-sm text-muted-foreground">
                      Document is encrypted and stored on IPFS
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium mb-1">Mint NFT</p>
                    <p className="text-sm text-muted-foreground">
                      Credential is minted as an NFT to student's wallet
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Issuances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">B.Tech Degree</p>
                    <p className="text-muted-foreground text-xs">0x1234...5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Web3 Certificate</p>
                    <p className="text-muted-foreground text-xs">0xabcd...ef12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssuerPage;
