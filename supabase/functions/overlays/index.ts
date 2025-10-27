import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const url = new URL(req.url);
    const method = req.method;
    const overlayId = url.searchParams.get('id');

    console.log(`Processing ${method} request for overlays`, { user: user.id, overlayId });

    // GET - Read overlays
    if (method === 'GET') {
      if (overlayId) {
        // Get single overlay
        const { data, error } = await supabaseClient
          .from('overlays')
          .select('*')
          .eq('id', overlayId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching overlay:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Get all user overlays
        const { data, error } = await supabaseClient
          .from('overlays')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching overlays:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // POST - Create overlay
    if (method === 'POST') {
      const body = await req.json();
      
      const { data, error } = await supabaseClient
        .from('overlays')
        .insert({
          user_id: user.id,
          name: body.name,
          type: body.type,
          content: body.content,
          image_url: body.image_url,
          position_x: body.position_x || 0,
          position_y: body.position_y || 0,
          width: body.width || 100,
          height: body.height || 100,
          font_size: body.font_size,
          color: body.color,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating overlay:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log('Overlay created successfully:', data.id);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT - Update overlay
    if (method === 'PUT') {
      if (!overlayId) {
        return new Response(JSON.stringify({ error: 'Overlay ID required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      const body = await req.json();

      const { data, error } = await supabaseClient
        .from('overlays')
        .update({
          name: body.name,
          type: body.type,
          content: body.content,
          image_url: body.image_url,
          position_x: body.position_x,
          position_y: body.position_y,
          width: body.width,
          height: body.height,
          font_size: body.font_size,
          color: body.color,
        })
        .eq('id', overlayId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating overlay:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log('Overlay updated successfully:', data.id);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE - Delete overlay
    if (method === 'DELETE') {
      if (!overlayId) {
        return new Response(JSON.stringify({ error: 'Overlay ID required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      const { error } = await supabaseClient
        .from('overlays')
        .delete()
        .eq('id', overlayId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting overlay:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }

      console.log('Overlay deleted successfully:', overlayId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
