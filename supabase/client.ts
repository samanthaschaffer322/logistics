// Mock Supabase client for static export compatibility

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        data: [],
        error: null
      }),
      data: [],
      error: null
    }),
    insert: (data: any) => ({
      data: null,
      error: null
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    })
  })
}

export const isSupabaseConfigured = false

export default supabase
