import { useState, useCallback, useEffect } from "react";

interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

interface LoadingTask {
  id: string;
  message?: string;
  progress?: number;
}

class GlobalLoadingManager {
  private tasks: Map<string, LoadingTask> = new Map();
  private listeners: Set<(state: LoadingState) => void> = new Set();

  addTask(id: string, message?: string): void {
    this.tasks.set(id, { id, message });
    this.notifyListeners();
  }

  updateTask(id: string, updates: Partial<LoadingTask>): void {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.set(id, { ...task, ...updates });
      this.notifyListeners();
    }
  }

  removeTask(id: string): void {
    this.tasks.delete(id);
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const state: LoadingState = {
      isLoading: this.tasks.size > 0,
      message: this.getPrimaryMessage(),
      progress: this.getAverageProgress(),
    };

    this.listeners.forEach((listener) => listener(state));
  }

  private getPrimaryMessage(): string | undefined {
    const tasks = Array.from(this.tasks.values());
    return tasks.length > 0 ? tasks[0].message : undefined;
  }

  private getAverageProgress(): number | undefined {
    const tasks = Array.from(this.tasks.values()).filter(
      (task) => task.progress !== undefined,
    );
    if (tasks.length === 0) return undefined;

    const total = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    return Math.round(total / tasks.length);
  }

  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

const globalLoadingManager = new GlobalLoadingManager();

export const useGlobalLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });

  useEffect(() => {
    const unsubscribe = globalLoadingManager.subscribe(setLoadingState);
    return unsubscribe;
  }, []);

  const startLoading = useCallback((id: string, message?: string) => {
    globalLoadingManager.addTask(id, message);
  }, []);

  const updateLoading = useCallback(
    (id: string, updates: Partial<LoadingTask>) => {
      globalLoadingManager.updateTask(id, updates);
    },
    [],
  );

  const stopLoading = useCallback((id: string) => {
    globalLoadingManager.removeTask(id);
  }, []);

  return {
    ...loadingState,
    startLoading,
    updateLoading,
    stopLoading,
  };
};

export const useLoadingTask = (id: string, message?: string) => {
  const { startLoading, updateLoading, stopLoading } = useGlobalLoading();

  const start = useCallback(
    (customMessage?: string) => {
      startLoading(id, customMessage || message);
    },
    [id, message, startLoading],
  );

  const update = useCallback(
    (updates: Partial<LoadingTask>) => {
      updateLoading(id, updates);
    },
    [id, updateLoading],
  );

  const stop = useCallback(() => {
    stopLoading(id);
  }, [id, stopLoading]);

  return { start, update, stop };
};
