import { db, User, Progress, Submission, Achievement } from './db/schema';

interface ExportData {
  version: string;
  exportedAt: string;
  appName: string;
  data: UserDataDump;
}

interface UserDataDump {
  user: User;
  progress: Progress | null;
  submissions: Submission[];
  achievements: Achievement[];
}

export async function exportProgress(): Promise<void> {
  try {
    const user = await db.users.orderBy('lastLogin').last();
    
    if (!user || !user.id) {
      throw new Error("No user data found to export.");
    }

    const userId = user.id;

    const progress = await db.progress.where('userId').equals(userId).first();
    const submissions = await db.submissions.where('userId').equals(userId).toArray();
    const achievements = await db.achievements.where('userId').equals(userId).toArray();
    
    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'Nexora Learn',
      data: {
        user: user,
        progress: progress || null,
        submissions: submissions,
        achievements: achievements
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `nexora-backup-${user.username}-${timestamp}.json`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error: any) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error.message}`);
  }
}

export async function importProgress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData: ExportData = JSON.parse(content);

        if (!importData.version || !importData.appName || !importData.data) {
          throw new Error('Invalid file format.');
        }

        if (importData.appName !== 'Nexora Learn' && importData.appName !== 'CodeForge AI') {
          throw new Error('Invalid backup file source.');
        }

        await db.transaction('rw', db.users, db.progress, db.submissions, db.achievements, async () => {
          const { user, progress, submissions, achievements } = importData.data;

          if (user) await db.users.put(user);
          if (progress) await db.progress.put(progress);
          
          if (submissions && submissions.length > 0) {
              await db.submissions.bulkPut(submissions);
          }
          
          if (achievements && achievements.length > 0) {
              await db.achievements.bulkPut(achievements);
          }
        });

        resolve(importData.data.user.username);
      } catch (error: any) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

export async function isFirstTimeUser(): Promise<boolean> {
  const count = await db.users.count();
  return count === 0;
}