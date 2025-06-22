import * as React from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/shared/context/authContex";
import { useAllUsers, useUploadUsers } from "../hooks/useUser";
import { DataTable } from "@/shared/components/table/table";
import { userColumns } from "./table/column";
import type { IUser } from "../types/user.type";
import LoadingSpinner from "@/features/redirect/pages/Loading";
import { AlertTriangle, CheckCircle2, SkipForward, XCircle, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";


export default function Index() {
  const { accessToken } = useAuthContext();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showReport, setShowReport] = React.useState(false);

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useAllUsers(accessToken || "");

  const {
    mutateAsync: uploadFileAsync,
    isPending: isUploading,
    data: uploadResult,
    reset
  } = useUploadUsers(accessToken || "");

  const handleAddManyClick = () => {
    setShowReport(false);
    reset();
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const promise = uploadFileAsync(file);

      toast.promise(promise, {
        loading: 'Uploading file, please wait...',
        success: (data) => {
          setShowReport(true); 
          const successCount = data.filter(r => r.status === 'success').length;
          // navigate(0)
          return `Upload complete! ${successCount} user(s) created.`;
        },
        error: (err) => {
          setShowReport(true); 
          return `Upload failed: ${err.message}`;
        },
      });
    }
  };

  const summary = React.useMemo(() => {
    if (!uploadResult) return null;
    const successCount = uploadResult.filter(r => r.status === 'success').length;
    const errorCount = uploadResult.filter(r => r.status === 'error').length;
    const skippedCount = uploadResult.filter(r => r.status === 'skipped').length;
    const totalProcessed = successCount + errorCount + skippedCount;
    return { successCount, errorCount, skippedCount, total: totalProcessed };
  }, [uploadResult]);

  if (isUsersLoading) return <LoadingSpinner />;
  if (isUsersError) return <div>Error fetching users: {String(usersError)}</div>;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      {showReport && summary && uploadResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upload Report</CardTitle>
              <p className="text-sm text-muted-foreground">
                Finished processing {summary.total} rows from the file.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowReport(false)}>
              <XIcon className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Progress value={summary.total > 0 ? (summary.successCount / summary.total) * 100 : 0} className="w-full" />
              <div className="flex justify-around mt-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <CheckCircle2 className="w-4 h-4" /> {summary.successCount}
                  </span>
                  <span className="text-xs text-muted-foreground">Successful</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-red-600">
                    <XCircle className="w-4 h-4" /> {summary.errorCount}
                  </span>
                  <span className="text-xs text-muted-foreground">Failed</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-500">
                    <SkipForward className="w-4 h-4" /> {summary.skippedCount}
                  </span>
                  <span className="text-xs text-muted-foreground">Skipped</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="failed" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="failed" disabled={summary.errorCount === 0}>Failed ({summary.errorCount})</TabsTrigger>
                <TabsTrigger value="successful" disabled={summary.successCount === 0}>Successful ({summary.successCount})</TabsTrigger>
                <TabsTrigger value="skipped" disabled={summary.skippedCount === 0}>Skipped ({summary.skippedCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="failed">
                <div className="p-2 mt-2 space-y-2 text-sm border rounded-md max-h-40 overflow-y-auto">
                  {uploadResult.filter(r => r.status === 'error').map((result, index) => (
                    <div key={index} className="flex items-start gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><b>{result.email || 'N/A'}:</b> {result.reason}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="successful">
                 <div className="p-2 mt-2 space-y-2 text-sm border rounded-md max-h-40 overflow-y-auto">
                  {uploadResult.filter(r => r.status === 'success').map((result, index) => (
                    <div key={index} className="flex items-start gap-2 text-green-700">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><b>{result.email}:</b> User was created successfully.</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="skipped">
                <div className="p-2 mt-2 space-y-2 text-sm border rounded-md max-h-40 overflow-y-auto">
                  {uploadResult.filter(r => r.status === 'skipped').map((result, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-600">
                      <SkipForward className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span><b>{result.email}:</b> Skipped, user already exists.</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <DataTable<IUser>
        data={usersData?.data ?? []}
        path="/staff/data-user/create"
        columns={userColumns}
        rowIdKey="id"
        addSectionLabel="Add New User"
        addManyButton={true}
        onAddManyClick={handleAddManyClick}
        addManyLabel="Import Users"
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        disabled={isUploading}
      />
    </div>
  );
}