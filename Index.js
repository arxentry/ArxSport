<!-- JavaScript -->
    <script>
        // --- 全局变量和配置 ---
        let currentReservationCount = 499; 
        const PRIZE_TARGET = 500; 

        // 预约计数器元素
        const reservationCountElement = document.getElementById('reservation-count');
        const prizeMessageElement = document.getElementById('prize-message');
        const prizeStatusElement = document.getElementById('prize-status');

        // 移动菜单元素
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

        // 预约模态框元素
        const bookingModal = document.getElementById('booking-modal');
        const modalContent = document.getElementById('modal-content');
        // START: FIX - Corrected ID to 'close-modal-button'
        const closeModalButton = document.getElementById('close-modal-button');
        // END: FIX
        const confirmBookingButton = document.getElementById('confirm-booking-button');
        // START: FIX - Corrected ID to 'modal-sport-title'
        const sportTitle = document.getElementById('modal-sport-title');
        // END: FIX
        const rotatorFaces = document.querySelectorAll('.rotator-face');

        // 身份验证模态框元素
        const authModal = document.getElementById('auth-modal');
        const authModalContent = document.getElementById('auth-modal-content');
        const authModalTitle = document.getElementById('auth-modal-title');
        const openAuthModalButton = document.getElementById('auth-modal-button');
        const openMobileAuthButton = document.getElementById('mobile-auth-button');
        const closeAuthModalButton = document.getElementById('close-auth-modal-button');

        // 身份验证视图
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        // START: FIX - Removed duplicate forgotPasswordView declaration
        const forgotPasswordView = document.getElementById('forgot-password-view');
        // END: FIX
        const authMessage = document.getElementById('auth-message');

        // 视图切换链接
        const showRegisterLink = document.getElementById('show-register-view');
        const showLoginLink = document.getElementById('show-login-view');
        const showForgotPasswordLink = document.getElementById('show-forgot-password-view');
        const showLoginFromForgotLink = document.getElementById('show-login-view-from-forgot');

        // 表单
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        // START: FIX - Removed duplicate forgotPasswordForm declaration
        const forgotPasswordForm = document.getElementById('forgot-password-form');
        // END: FIX
        
        // START: 新增 - 登录Tab元素
        let activeLoginTab = 'email'; // 默认登录方式
        const loginTabButtons = document.querySelectorAll('.login-tab-btn');
        const loginEmailInput = document.getElementById('login-email');
        const loginPhoneInput = document.getElementById('login-phone');
        const loginUsernameInput = document.getElementById('login-username');
        const loginInputEmailWrapper = document.getElementById('login-input-email');
        const loginInputPhoneWrapper = document.getElementById('login-input-phone');
        const loginInputUsernameWrapper = document.getElementById('login-input-username');
        
        // START: 新增 - 注册表单额外字段
        const registerUsernameInput = document.getElementById('register-username');

        // START: 新增 - 忘记密码Tab元素
        let activeForgotTab = 'email'; // 默认重置方式
        const forgotTabButtons = document.querySelectorAll('.forgot-tab-btn');
        const forgotEmailInput = document.getElementById('forgot-email');
        const forgotPhoneInput = document.getElementById('forgot-phone');
        const forgotInputEmailWrapper = document.getElementById('forgot-input-email');
        const forgotInputPhoneWrapper = document.getElementById('forgot-input-phone');
        // END: 新增元素

        // START: 新增 - 登录状态管理
        let isUserLoggedIn = false;
        let sportToBookAfterLogin = null; // 用于存储登录后需要打开的运动项目
        // END: 新增 - 登录状态管理

        // 自定义提示框元素
        const customAlert = document.getElementById('custom-alert');
        const customAlertContent = document.getElementById('custom-alert-content');
        const customAlertMessage = document.getElementById('custom-alert-message');
        const customAlertCloseButton = document.getElementById('custom-alert-close');

        
        // --- 移动端菜单逻辑 ---
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // 点击移动端链接后关闭菜单
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // --- 预约计数器逻辑 ---
        function formatNumber(num) {
            return num.toString().padStart(3, '0');
        }

        function updateReservationCounter() {
            if (!reservationCountElement) return; // 确保元素存在
            reservationCountElement.textContent = formatNumber(currentReservationCount);

            if (currentReservationCount === PRIZE_TARGET) {
                prizeMessageElement.classList.add('hidden');
                prizeStatusElement.classList.remove('hidden');
            } else if (currentReservationCount > PRIZE_TARGET) {
                prizeMessageElement.innerHTML = `恭喜第 <span class="text-neon-fuchsia font-bold text-lg">${PRIZE_TARGET}</span> 位幸运用户已产生！`;
                prizeStatusElement.classList.add('hidden');
            } else {
                const remaining = PRIZE_TARGET - currentReservationCount;
                prizeMessageElement.innerHTML = `再有 <span class="text-neon-cyan font-bold text-lg">${remaining}</span> 位预约用户，将送出豪华礼包！`;
                prizeStatusElement.classList.add('hidden');
            }
        }
        
        // --- 自定义提示框逻辑 (替换 alert) ---
        function showCustomAlert(message, title = "提示") {
            customAlertMessage.textContent = message;
            document.getElementById('custom-alert-title').textContent = title;
            
            customAlert.classList.remove('hidden');
            setTimeout(() => {
                customAlert.classList.remove('opacity-0');
                customAlertContent.classList.remove('scale-95');
            }, 10);
        }

        function closeCustomAlert() {
            customAlert.classList.add('opacity-0');
            customAlertContent.classList.add('scale-95');
            setTimeout(() => {
                customAlert.classList.add('hidden');
            }, 300);
        }

        customAlertCloseButton.addEventListener('click', closeCustomAlert);
        customAlert.addEventListener('click', (e) => {
            if (e.target === customAlert) {
                closeCustomAlert();
            }
        });


        // --- 预约模态框逻辑 ---
        let selectedSport = '';

        function openBookingModal(sportName) {
            selectedSport = sportName;
            // START: FIX - Check if sportTitle exists before setting textContent
            if (sportTitle) {
                sportTitle.textContent = `预约 ${sportName}`;
            }
            // END: FIX
            bookingModal.classList.remove('hidden');
            bookingModal.classList.add('flex');
            
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10); 
        }

        function closeBookingModal() {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                bookingModal.classList.add('hidden');
                bookingModal.classList.remove('flex');
            }, 300);
        }

        rotatorFaces.forEach(face => {
            face.addEventListener('click', () => {
                const sportName = face.getAttribute('data-sport');
                
                // START: MODIFIED - 检查登录状态
                if (isUserLoggedIn) {
                    // 1. 如果已登录，直接打开预约模态框
                    openBookingModal(sportName);
                } else {
                    // 2. 如果未登录，记录他们想预约的项目，并打开登录模态框
                    sportToBookAfterLogin = sportName;
                    openAuthModal('login');
                    // 提示用户需要登录
                    setTimeout(() => showAuthMessage('请先登录以继续预约。', true), 300);
                }
                // END: MODIFIED
            });
        });

        // START: FIX - Add safety check for closeModalButton
        if (closeModalButton) {
            closeModalButton.addEventListener('click', closeBookingModal);
        } else {
            console.error("Booking modal close button ('close-modal-button') not found.");
        }
        // END: FIX

        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });

        // 模拟确认预约事件 (移除 alert)
        confirmBookingButton.addEventListener('click', () => {
            const selectedSlot = document.querySelector('.time-slot-btn.bg-neon-fuchsia');
            if (!selectedSlot) {
                // 使用自定义提示框
                showCustomAlert('请选择一个时段进行预约！', '操作无效');
                return;
            }

            currentReservationCount++;
            updateReservationCounter(); 

            const venue = document.querySelector('select').value;
            const time = selectedSlot.getAttribute('data-time');

            const confirmationMessage = `您已成功预约 ${selectedSport}，时间：${time}，地点：${venue || '附近的场馆'}`;
            
            let prizeMessage = "";
            if (currentReservationCount === PRIZE_TARGET) {
                prizeMessage = "\n🎉 恭喜您成为幸运儿！请联系客服领取奖品！";
            }
            
            // 关闭预约模态框并显示成功提示
            closeBookingModal();
            setTimeout(() => {
                showCustomAlert(confirmationMessage + prizeMessage, '✅ 预约成功！');
            }, 300); // 延迟显示，等待上一个模态框关闭动画
        });


        // --- 身份验证模态框逻辑 (新增) ---
        
        function showAuthMessage(message, isError = false) {
            authMessage.textContent = message;
            authMessage.classList.remove('hidden');
            if (isError) {
                authMessage.classList.remove('bg-green-100', 'text-green-700');
                authMessage.classList.add('bg-red-100', 'text-red-700'); // 错误样式
            } else {
                authMessage.classList.remove('bg-red-100', 'text-red-700');
                authMessage.classList.add('bg-green-100', 'text-green-700'); // 成功样式
            }
        }

        function clearAuthMessage() {
            authMessage.classList.add('hidden');
            authMessage.textContent = '';
        }

        // START: 新增 - 登录Tab切换逻辑
        function showLoginTab(tabId) {
            activeLoginTab = tabId;
            
            // 更新Tab按钮样式
            loginTabButtons.forEach(btn => {
                const isBtnActive = btn.id === `login-tab-${tabId}`;
                btn.classList.toggle('text-indigo-600', isBtnActive);
                btn.classList.toggle('border-indigo-500', isBtnActive);
                btn.classList.toggle('text-gray-500', !isBtnActive);
                btn.classList.toggle('border-transparent', !isBtnActive);
                btn.classList.toggle('hover:text-gray-700', !isBtnActive);
                btn.classList.toggle('hover:border-gray-300', !isBtnActive);
            });

            // 更新输入框可见性
            loginInputEmailWrapper.classList.toggle('hidden', tabId !== 'email');
            loginInputPhoneWrapper.classList.toggle('hidden', tabId !== 'phone');
            loginInputUsernameWrapper.classList.toggle('hidden', tabId !== 'username');
            
            // 更新输入框的 required 属性
            if(loginEmailInput) loginEmailInput.required = (tabId === 'email');
            if(loginPhoneInput) loginPhoneInput.required = (tabId === 'phone');
            if(loginUsernameInput) loginUsernameInput.required = (tabId === 'username');
        }
        
        // START: 新增 - 忘记密码Tab切换逻辑
        function showForgotTab(tabId) {
            activeForgotTab = tabId;

            // 更新Tab按钮样式
            forgotTabButtons.forEach(btn => {
                const isBtnActive = btn.id === `forgot-tab-${tabId}`;
                btn.classList.toggle('text-indigo-600', isBtnActive);
                btn.classList.toggle('border-indigo-500', isBtnActive);
                btn.classList.toggle('text-gray-500', !isBtnActive);
                btn.classList.toggle('border-transparent', !isBtnActive);
                btn.classList.toggle('hover:text-gray-700', !isBtnActive);
                btn.classList.toggle('hover:border-gray-300', !isBtnActive);
            });

            // 更新输入框可见性
            forgotInputEmailWrapper.classList.toggle('hidden', tabId !== 'email');
            forgotInputPhoneWrapper.classList.toggle('hidden', tabId !== 'phone');

            // 更新输入框的 required 属性
            if(forgotEmailInput) forgotEmailInput.required = (tabId === 'email');
            if(forgotPhoneInput) forgotPhoneInput.required = (tabId === 'phone');
        }


        function showAuthView(viewId) {
            clearAuthMessage();
            if(loginView) loginView.classList.add('hidden');
            if(registerView) registerView.classList.add('hidden');
            if(forgotPasswordView) forgotPasswordView.classList.add('hidden');

            // 如果用户从登录视图切换到其他视图（如注册），则取消待处理的预约
            if (viewId !== 'login') {
                sportToBookAfterLogin = null;
            }

            if (viewId === 'login') {
                if(loginView) loginView.classList.remove('hidden');
                if(authModalTitle) authModalTitle.textContent = '欢迎回来';
                showLoginTab('email'); // 重置为默认Tab
            } else if (viewId === 'register') {
                if(registerView) registerView.classList.remove('hidden');
                if(authModalTitle) authModalTitle.textContent = '创建新账户';
            } else if (viewId === 'forgot-password') {
                if(forgotPasswordView) forgotPasswordView.classList.remove('hidden');
                if(authModalTitle) authModalTitle.textContent = '重置密码';
                showForgotTab('email'); // 重置为默认Tab
            }
        }

        function openAuthModal(defaultView = 'login') {
            showAuthView(defaultView);
            authModal.classList.remove('hidden');
            authModal.classList.add('flex');
            
            setTimeout(() => {
                authModalContent.classList.remove('scale-95', 'opacity-0');
                authModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
            
            // 如果从移动菜单打开，先关闭移动菜单
            if(mobileMenu) mobileMenu.classList.add('hidden');
        }

        function closeAuthModal() {
            authModalContent.classList.remove('scale-100', 'opacity-100');
            authModalContent.classList.add('scale-95', 'opacity-0');
            
            // 如果用户关闭了登录框，则取消待处理的预约
            sportToBookAfterLogin = null;

            setTimeout(() => {
                authModal.classList.add('hidden');
                authModal.classList.remove('flex');
            }, 300);
        }

        // START: 新增 - 根据登录状态更新UI
        function updateAuthUI() {
            if (isUserLoggedIn) {
                if (openAuthModalButton) openAuthModalButton.textContent = '退出登录';
                if (openMobileAuthButton) openMobileAuthButton.textContent = '退出登录';
            } else {
                if (openAuthModalButton) openAuthModalButton.textContent = '登录/注册';
                if (openMobileAuthButton) openMobileAuthButton.textContent = '登录/注册';
            }
        }
        // END: 新增 - 根据登录状态更新UI

        // 监听触发器
        // START: MODIFIED - 修改登录按钮的点击逻辑
        function handleAuthButtonClick() {
            if (isUserLoggedIn) {
                // 如果已登录 -> 登出
                isUserLoggedIn = false;
                sportToBookAfterLogin = null; // 清除待处理预约
                updateAuthUI();
                showCustomAlert('您已成功退出登录。', '操作完成');
            } else {
                // 如果未登录 -> 打开登录模态框
                openAuthModal('login');
            }
        }
        
        if(openAuthModalButton) openAuthModalButton.addEventListener('click', handleAuthButtonClick);
        if(openMobileAuthButton) openMobileAuthButton.addEventListener('click', handleAuthButtonClick);
        // END: MODIFIED
        
        if(closeAuthModalButton) closeAuthModalButton.addEventListener('click', closeAuthModal);
        
        if(authModal) authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });

        // 监听视图切换链接
        if(showRegisterLink) showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthView('register');
        });
        if(showLoginLink) showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthView('login');
        });
        if(showForgotPasswordLink) showForgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthView('forgot-password');
        });
        if(showLoginFromForgotLink) showLoginFromForgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthView('login');
        });

        // START: 新增 - 监听Tab点击事件
        if(document.getElementById('login-tab-email')) document.getElementById('login-tab-email').addEventListener('click', () => showLoginTab('email'));
        if(document.getElementById('login-tab-phone')) document.getElementById('login-tab-phone').addEventListener('click', () => showLoginTab('phone'));
        if(document.getElementById('login-tab-username')) document.getElementById('login-tab-username').addEventListener('click', () => showLoginTab('username'));
        
        if(document.getElementById('forgot-tab-email')) document.getElementById('forgot-tab-email').addEventListener('click', () => showForgotTab('email'));
        if(document.getElementById('forgot-tab-phone')) document.getElementById('forgot-tab-phone').addEventListener('click', () => showForgotTab('phone'));
        // END: 新增 - 监听Tab点击事件


        // 监听表单提交 (模拟)
        if(loginForm) loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let identifier = '';
            // 根据激活的Tab获取对应的输入值
            if (activeLoginTab === 'email') {
                identifier = loginEmailInput.value;
            } else if (activeLoginTab === 'phone') {
                identifier = loginPhoneInput.value;
            } else if (activeLoginTab === 'username') {
                identifier = loginUsernameInput.value;
            }
            
            // 获取密码
            const password = document.getElementById('login-password').value;
            
            console.log(`登录尝试 (${activeLoginTab}):`, identifier);
            
            // --- START: MODIFIED - 添加特定用户名和密码验证 ---
            if (activeLoginTab === 'username' && identifier === 'ARX' && password === 'ARX2025') {
                // 登录成功
                console.log('登录成功: ARX');
                
                // 1. 设置登录状态
                isUserLoggedIn = true;
                // 2. 更新UI（例如，将“登录”按钮变为“退出登录”）
                updateAuthUI();
                
                // 3. 模拟API调用
                showAuthMessage('登录成功！欢迎回来。', false);
                
                // 4. 1.5秒后关闭登录模态框
                setTimeout(() => {
                    closeAuthModal();

                    // 5. (关键步骤) 检查是否有待处理的预约
                    if (sportToBookAfterLogin) {
                        // 延迟 300ms（等待登录框关闭动画完成）后打开预约框
                        setTimeout(() => {
                            openBookingModal(sportToBookAfterLogin);
                            sportToBookAfterLogin = null; // 清除待处理状态
                        }, 300);
                    }
                }, 1500);

            } else {
                // 登录失败
                console.log(`登录失败 (${activeLoginTab}):`, identifier);
                let errorMessage = '登录信息不正确。';
                if (activeLoginTab !== 'username') {
                    errorMessage = '请切换到“用户名”方式登录。';
                } else if (identifier !== 'ARX') {
                    errorMessage = '用户名不正确。';
                } else if (password !== 'ARX2025') {
                    errorMessage = '密码不正确。';
                }
                showAuthMessage(errorMessage, true);
            }
            // --- END: MODIFIED ---
        });

        if(registerForm) registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = registerEmailInput.value;
            const username = registerUsernameInput.value; // 获取用户名
            const password = registerForm.password.value;
            const confirmPassword = registerForm['confirm-password'].value;

            if (password !== confirmPassword) {
                showAuthMessage('两次输入的密码不一致！', true);
                return;
            }
            console.log("注册尝试:", email, "用户名:", username); // 更新日志
            // 模拟API调用
            showAuthMessage('注册成功！正在跳转至登录...', false);
            setTimeout(() => showAuthView('login'), 1500);
        });

        if(forgotPasswordForm) forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let identifier = '';
            // 根据激活的Tab获取对应的输入值
            if (activeForgotTab === 'email') {
                identifier = forgotEmailInput.value;
            } else if (activeForgotTab === 'phone') {
                identifier = forgotPhoneInput.value;
            }

            console.log(`密码重置请求 (${activeForgotTab}):`, identifier);
            // 模拟API调用
            showAuthMessage(`重置链接/验证码已发送至 ${identifier}，请注意查收。`, false);
            setTimeout(() => showAuthView('login'), 2500);
        });


        // --- 时段选择切换逻辑 ---
        document.querySelectorAll('.time-slot-btn').forEach(btn => {
            if (!btn.classList.contains('cursor-not-allowed')) {
                btn.addEventListener('click', (e) => {
                    // 移除所有已选状态
                    document.querySelectorAll('.time-slot-btn').forEach(b => {
                        if (b.classList.contains('bg-neon-fuchsia')) {
                            b.classList.remove('bg-neon-fuchsia', 'text-gray-900', 'border-2', 'border-white/50', 'shadow-lg');
                            b.classList.add('bg-green-700', 'text-white', 'opacity-80');
                        }
                    });

                    // 设置当前按钮为选中状态
                    e.currentTarget.classList.remove('bg-green-700', 'text-white', 'opacity-80');
                    e.currentTarget.classList.add('bg-neon-fuchsia', 'text-gray-900', 'border-2', 'border-white/50', 'shadow-lg');
                });
            }
        });

        // --- 页面初始化 ---
        document.addEventListener('DOMContentLoaded', () => {
            updateReservationCounter(); // 页面加载时初始化计数器显示
            // START: FIX - Run initial tab setup on load
            showLoginTab('email');
            showForgotTab('email');
            // END: FIX
            updateAuthUI(); // 初始化登录按钮的文本
        });

    </script>