include $(TOPDIR)/rules.mk

PKG_NAME:=luci-theme-aeris
PKG_VERSION:=1.0.2
PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=wizcheu

LUCI_NAME:=luci-theme-aeris
LUCI_TITLE:=Aeris — responsive LuCI theme
LUCI_DEPENDS:=+luci-base +rpcd-mod-luci
LUCI_PKGARCH:=all
LUCI_URL:=https://github.com/wizcheu/luci-theme-aeris
LUCI_MAINTAINER:=wizcheu
LUCI_MINIFY_JS:=0
LUCI_MINIFY_CSS:=0

define Package/luci-theme-aeris/preinst
#!/bin/sh
if [ -z "$${IPKG_INSTROOT}" ] && [ ! -f /usr/share/ucode/luci/runtime.uc ]; then
	echo 'Aeris requires ucode-based LuCI.' >&2
	exit 1
fi
exit 0
endef

define Package/luci-theme-aeris/postrm
#!/bin/sh
[ "$$1" = upgrade ] && exit 0
[ -n "$${IPKG_INSTROOT}" ] || {
	if [ "$$(uci -q get luci.main.mediaurlbase)" = /luci-static/aeris ]; then
		uci -q delete luci.main.mediaurlbase
	fi
	uci -q delete luci.themes.Aeris
	uci commit luci
	rm -f /tmp/luci-indexcache.*
}
endef

define Build/Prepare/luci-theme-aeris
	$(INSTALL_DIR) $(PKG_BUILD_DIR)/root/usr/share/luci-theme-aeris
	$(CP) ./LICENSE ./NOTICE $(PKG_BUILD_DIR)/root/usr/share/luci-theme-aeris/
endef

include $(TOPDIR)/feeds/luci/luci.mk
# call BuildPackage - OpenWrt buildroot signature
