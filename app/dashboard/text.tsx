useEffect(() => {
  const supabase = createClient();

  const checkUserAndVerification = async () => {
    try {
      // Get user data
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      // Check verification status directly from user metadata
      if (userData.user) {
        setIsVerified(!!userData.user.email_confirmed_at);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    } finally {
      setVerificationLoading(false);
    }
  };

  checkUserAndVerification();

  // Only set initial symptoms once when component mounts and userInput exists
  if (initialSymptoms && !initialSymptomState) {
    setInitialSymptomState(initialSymptoms);
    // Remove userInput from the URL after storing it in state
    const params = new URLSearchParams(searchParams.toString());
    params.delete('userInput');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }
}, [initialSymptoms, searchParams, router, pathname, initialSymptomState]);
