(function () {
    'use strict';

    const ready = window.supabase &&
        window.SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
        window.SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
    const client = ready ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

    window.portofwebDb = {
        enabled: !!client,
        async load(key) {
            if (!client) return null;
            const { data, error } = await client.from('site_content').select('payload').eq('key', key).maybeSingle();
            if (error) throw error;
            return data ? data.payload : null;
        },
        async save(key, payload) {
            if (!client) throw new Error('Supabase is not configured.');
            const { error } = await client.from('site_content').upsert({ key, payload }, { onConflict: 'key' });
            if (error) throw error;
        },
        async session() {
            return client ? (await client.auth.getSession()).data.session : null;
        },
        async signIn(email, password) {
            if (!client) throw new Error('Supabase is not configured.');
            const { error } = await client.auth.signInWithPassword({ email, password });
            if (error) throw error;
        },
        async signOut() {
            if (client) await client.auth.signOut();
        }
    };
})();
