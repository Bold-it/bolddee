import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secret } = await req.json();
    const adminSecret = Deno.env.get('ADMIN_SECRET');

    console.log('Admin login attempt');

    if (!secret || !adminSecret || secret !== adminSecret) {
      console.log('Invalid admin secret');
      return new Response(
        JSON.stringify({ error: 'Invalid admin secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin user with fixed credentials
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const adminEmail = 'admin@famsapplehub.com';
    const adminPassword = adminSecret;

    // Try to sign in first
    let authResult = await supabaseAdmin.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    // If sign in fails, handle admin user creation or password update
    if (authResult.error) {
      console.log('Sign in failed, checking if user exists');
      
      // Try to get the user by email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === adminEmail);

      if (existingUser) {
        console.log('Admin user exists, updating password');
        // User exists but password is wrong - update the password
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { password: adminPassword }
        );

        if (updateError) {
          console.error('Error updating admin password:', updateError);
          throw updateError;
        }

        // Ensure admin role exists
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert({ 
            user_id: existingUser.id, 
            role: 'admin' 
          }, { onConflict: 'user_id,role' });

        if (roleError) {
          console.error('Error adding admin role:', roleError);
        }

        // Sign in with new password
        authResult = await supabaseAdmin.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });
      } else {
        console.log('Creating new admin user');
        // User doesn't exist - create new admin
        const signUpResult = await supabaseAdmin.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
        });

        if (signUpResult.error) {
          console.error('Error creating admin:', signUpResult.error);
          throw signUpResult.error;
        }

        // Add admin role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert({ 
            user_id: signUpResult.data.user.id, 
            role: 'admin' 
          }, { onConflict: 'user_id,role' });

        if (roleError) {
          console.error('Error adding admin role:', roleError);
        }

        // Sign in
        authResult = await supabaseAdmin.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });
      }
    }

    if (authResult.error || !authResult.data.session) {
      console.error('Auth error:', authResult.error);
      throw new Error('Authentication failed');
    }

    console.log('Admin login successful');

    return new Response(
      JSON.stringify({ 
        session: authResult.data.session,
        user: authResult.data.user
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-admin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
