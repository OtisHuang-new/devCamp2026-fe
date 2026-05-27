import { useState, useEffect } from 'react';
import { lessonApi } from '../api/lessonApi';
import type { LessonDataAPI } from '../types/lessonTypes';

export const useLesson = (lessonId: string | undefined) => {
  const [lesson, setLesson] = useState<LessonDataAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        const data = await lessonApi.getLessonById(lessonId);
        setLesson(data);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, isLoading };
};
