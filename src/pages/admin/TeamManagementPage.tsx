import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import TeamPhotoUploader from "@/components/admin/TeamPhotoUploader";
import { useTeam, TeamMember } from "@/contexts/TeamContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TeamManagementPage = () => {
  const { teamMembers, updateTeamMemberPhoto, isLoading } = useTeam();
  const [loading, setLoading] = useState(true);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(teamMembers.map(member => member.category)))];

  useEffect(() => {
    // Just a small delay to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort team members
  useEffect(() => {
    let result = [...teamMembers];
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(member => member.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        member => 
          member.name.toLowerCase().includes(query) || 
          member.role.toLowerCase().includes(query) ||
          (member.bio && member.bio.toLowerCase().includes(query))
      );
    }
    
    // Sort members
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case "name":
          valueA = a.name;
          valueB = b.name;
          break;
        case "role":
          valueA = a.role;
          valueB = b.role;
          break;
        case "category":
          valueA = a.category;
          valueB = b.category;
          break;
        default:
          valueA = a.name;
          valueB = b.name;
      }
      
      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
    
    setFilteredMembers(result);
  }, [teamMembers, selectedCategory, searchQuery, sortBy, sortDirection]);

  const handlePhotoUpdate = (memberId: number, newImageUrl: string) => {
    // Use the context method to update the photo
    updateTeamMemberPhoto(memberId, newImageUrl);
    
    // Log for debugging
    console.log(`Updated member ${memberId} with new image: ${newImageUrl}`);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved Successfully",
      description: "All team member photos have been updated and are now visible on the main website.",
      variant: "default",
    });
    
    // Log the updated team members for reference
    console.log("Updated team members:", teamMembers);
    
    // Show a more prominent success message
    const updatedCount = teamMembers.filter(member => !member.image.includes('/logo.png')).length;
    if (updatedCount > 0) {
      toast({
        title: `${updatedCount} Team Member Photos Updated`,
        description: "Visit the About page to see your changes live!",
        variant: "default",
      });
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Update team member photos and information</p>
          </div>
          <Button onClick={handleSaveChanges} className="bg-eco-green hover:bg-green-700">
            Save All Changes
          </Button>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Team Photo Management</AlertTitle>
          <AlertDescription>
            Upload photos for team members. Images will be automatically resized and optimized.
            For best results, use square images with a minimum size of 300x300 pixels.
          </AlertDescription>
        </Alert>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center">
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4 mr-2 text-gray-500" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2 text-gray-500" />
                )}
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="role">Role</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleSortDirection}
                  className="h-10 w-10"
                >
                  {sortDirection === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-[250px]"
              />
            </div>
          </div>
          
          {/* Results summary */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredMembers.length} of {teamMembers.length} team members
            {selectedCategory !== "All" && (
              <Badge variant="outline" className="ml-2 bg-green-50">
                {selectedCategory}
              </Badge>
            )}
          </div>
        </div>

        {loading || isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading team members...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-600">No team members found matching your criteria.</p>
                <Button 
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                    <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-200">
                      {member.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <TeamPhotoUploader 
                      memberId={member.id} 
                      currentImage={member.image} 
                      onPhotoUpdate={handlePhotoUpdate}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeamManagementPage;
