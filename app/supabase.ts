import { createClient } from '@supabase/supabase-js';

// env 파일 안 거치고 주소와 anon 키를 여기에 직접 고정!
const supabaseUrl = "https://eldlkzqamepywxpwploj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZGxrenFhbWVweXd4cHdwbG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjM4OTEsImV4cCI6MjA5OTY5OTg5MX0.41M8ePCD0yBwoSIlRqZaBdxsAroxgWOS93QvQufQoOg"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);